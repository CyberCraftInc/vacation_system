class User < ActiveRecord::Base
  devise    :database_authenticatable, :recoverable,
            :rememberable, :trackable, :validatable,
            :invitable

  has_many  :team_roles, dependent: :destroy
  has_many  :teams, through: :team_roles
  has_many  :vacation_requests, dependent: :destroy
  has_many  :available_vacations, dependent: :destroy
  has_many  :approval_requests, foreign_key: :manager_id, dependent: :destroy

  def manager_of?(team)
    team_roles.managers.where(team: team).exists?
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
end
