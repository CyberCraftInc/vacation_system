class Team < ActiveRecord::Base
  has_many  :team_roles
  has_many  :users, through: :team_roles
  has_many  :roles, through: :team_roles
end
