class User < ActiveRecord::Base
  devise    :database_authenticatable, :recoverable,
            :rememberable, :trackable, :validatable,
            :invitable

  has_many  :team_roles
  has_many  :teams, through: :team_roles
  has_many  :vacation_requests
  has_many  :available_vacations
  has_many  :approval_requests, foreign_key: :manager_id
end
