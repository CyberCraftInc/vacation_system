class User < ActiveRecord::Base
  devise    :database_authenticatable, :recoverable,
            :rememberable, :trackable, :validatable,
            :invitable

  has_many  :team_roles
  has_many  :vacation_requests
  has_many  :available_vacations
  has_many  :approval_requests
end
