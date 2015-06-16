class ChangeStatusInVacationRequests < ActiveRecord::Migration
  def up
    change_table :vacation_requests do |t|
      t.change :status_id, :integer
    end
  end

  def down
    change_table :vacation_requests do |t|
      t.change :status_id, :string
    end
  end
end
