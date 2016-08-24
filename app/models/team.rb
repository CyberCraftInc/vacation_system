class Team < ActiveRecord::Base
  has_many  :team_roles, dependent: :destroy
  has_many  :notification_teams, dependent: :destroy
  has_many  :users, through: :team_roles
  has_many  :notifications, through: :notification_teams

  validates :name,
            presence: true,
            uniqueness: true,
            length: { minimum: 3, maximum: 80 }
end
