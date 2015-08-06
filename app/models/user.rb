class User < ActiveRecord::Base
  devise    :database_authenticatable, :recoverable,
            :rememberable, :trackable, :validatable,
            :invitable

  has_many  :team_roles, dependent: :destroy
  has_many  :teams, through: :team_roles, dependent: :destroy
  has_many  :vacation_requests, dependent: :destroy
  has_many  :available_vacations, dependent: :destroy
  has_many  :approval_requests, foreign_key: :manager_id, dependent: :destroy

  def manager_of?(team)
    team_roles.managers.where(team: team).exists?
  end

  def manager?
    team_roles.managers.exists?
  end
end
