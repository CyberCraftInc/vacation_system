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

  validates :employment_date,
            presence: true,
            inclusion: { in: Date.new(2013, 1, 1)..Date.new(2050, 1, 1) }

  attr_accessor :skip_password_validation

  def as_json(options)
    options[:only] = [
      :id,
      :first_name,
      :last_name,
      :email,
      :birth_date,
      :employment_date
    ]

    super options
  end

  def accumulated_days(kind)
    days_since_employment * AvailableVacations::RATES[kind.to_sym]
  end

  def accumulated_days_of_all_types
    days = days_since_employment
    Hash[
      planned:  days * AvailableVacations::RATES[:planned],
      unpaid:   1,
      sickness: days * AvailableVacations::RATES[:sickness],
    ]
  end

  def days_since_employment
    return 0 if employment_date.nil?
    Time.zone.today - employment_date + 1
  end

  def full_name
    "#{first_name} #{last_name}".strip
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

  def admin?
    team_roles.admins.exists?
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

protected

  def password_required?
    return false if skip_password_validation
    super
  end
end
