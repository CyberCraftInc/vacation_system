class RenameStatusInVacationRequests < ActiveRecord::Migration
  def up
    change_table :vacation_requests do |t|
      t.rename :status, :status_id
    end
  end

  def down
    change_table :vacation_requests do |t|
      t.rename :status_id, :status
    end
  end
end
