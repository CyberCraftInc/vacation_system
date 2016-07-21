class Team < ActiveRecord::Base
  has_many  :team_roles, dependent: :destroy
  has_many  :users, through: :team_roles
  has_and_belongs_to_many :notifications,
                          association_foreign_key: 'notification_id',
                          class_name: 'Notification',
                          join_table: 'notifications_teams'

  validates :name,
            presence: true,
            uniqueness: true,
            length: { minimum: 3, maximum: 80 }
end
