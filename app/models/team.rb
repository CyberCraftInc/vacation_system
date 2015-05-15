class Team < ActiveRecord::Base
  has_many  :team_roles, as: :holder
end
