class CreateNotifications < ActiveRecord::Migration
  def up
    create_table :notifications do |t|
      t.string :notification_type
      t.integer :timer_days

      t.timestamps null: false
    end
  end

  def down
    drop_table :notifications
  end
end
