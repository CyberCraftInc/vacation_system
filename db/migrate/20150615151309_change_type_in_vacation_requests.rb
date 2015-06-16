class ChangeTypeInVacationRequests < ActiveRecord::Migration
  def change
    rename_column :vacation_requests, :type, :type_id
    change_column :vacation_requests, :type_id,
                  :integer,
                  references: :vacation_types
  end
end
