class CreateNotificationTeams < ActiveRecord::Migration
  def change
    create_table :notification_teams do |t|
      t.integer :notification_id
      t.integer :team_id

      t.timestamps null: false
    end
  end
end
