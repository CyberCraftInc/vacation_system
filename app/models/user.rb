class User < ActiveRecord::Base
  has_many  :team_roles, as: :holder
  has_many  :vacation_requests
  has_many  :available_vacations
  has_many  :approval_requests
end
