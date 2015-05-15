class User < ActiveRecord::Base
  has_many  :team_roles
  has_many  :vacation_requests
  has_many  :available_vacations
  has_many  :approval_requests
end
