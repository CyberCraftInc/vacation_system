class Team < ActiveRecord::Base
  has_many  :team_roles
  has_many  :users, through: :team_roles

  validates :name,
            presence: true,
            length: { minimum: 5, maximum: 35 }
end
