require 'available_vacations/calculus'

include AvailableVacations

class User < ActiveRecord::Base
  devise    :database_authenticatable, :recoverable,
            :rememberable, :trackable, :validatable,
            :invitable

  has_many  :team_roles, dependent: :destroy
  has_many  :teams, through: :team_roles
  has_many  :vacation_requests, dependent: :destroy
  has_many  :available_vacations, dependent: :destroy
  has_many  :approval_requests, foreign_key: :manager_id, dependent: :destroy

  def accumulated_days(kind)
    days_since_employment * AvailableVacations::RATES[kind.to_sym]
  end

  def accumulated_days_of_all_types
    days = days_since_employment
    Hash[
      planned:  days * PLANNED_PER_DAY,
      unpaid:   days * UNPAID_PER_DAY,
      sickness: days * SICKNESS_PER_DAY,
    ]
  end

  def days_since_employment
    return 0 if employment_date.nil?
    Time.zone.today - employment_date + 1
  end

  def full_name
    result = []
    result.push(first_name)  unless first_name.nil?
    result.push(last_name)   unless last_name.nil?
    result.join(' ')
  end

  def owns_vacation_request?(vacation_request)
    vacation_requests.ids.include? vacation_request.id
  end

  def manager_of?(team)
    team_roles.managers.where(team: team).exists?
  end

  def manager_of_user?(user)
    user.list_of_assigned_managers_ids.include? id
  end

  def manager?
    team_roles.managers.exists?
  end

  def member?
    team_roles.members.exists?
  end

  # List of managers' IDs the user is assigned to, from all the teams.
  # If user is manager, then remove the user from the list.
  def list_of_assigned_managers_ids
    managers_ids = TeamRole.where(team_id: teams.ids).managers.pluck(:user_id)
    managers_ids.delete(id) if manager?
    managers_ids
  end

  def used_days(kind)
    holidays = Holiday.dates
    used_vacations = vacation_requests.used
      .where(kind: VacationRequest.kinds[kind])

    used_vacations.reduce(0) do |sum, vacation|
      sum + vacation.duration(holidays)
    end
  end
end
