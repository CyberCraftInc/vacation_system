class TeamRole < ActiveRecord::Base
  belongs_to  :user
  belongs_to  :team
  belongs_to  :role
end
