class CreateVacationTypes < ActiveRecord::Migration
  def change
    create_table :vacation_types do |t|
      t.string :name

      t.timestamps null: false
    end
  end
end
