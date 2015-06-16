class ChangeTypeInAvailableVacations < ActiveRecord::Migration
  def change
    rename_column :available_vacations, :type, :type_id
    change_column :available_vacations, :type_id,
                  :integer,
                  references: :vacation_types
  end
end
