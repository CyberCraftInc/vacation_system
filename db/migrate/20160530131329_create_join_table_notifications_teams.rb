class CreateJoinTableNotificationsTeams < ActiveRecord::Migration
  def change
    create_join_table :notifications, :teams do |t|
      t.index [:notification_id, :team_id]
      t.index [:team_id, :notification_id]
    end
  end
end
