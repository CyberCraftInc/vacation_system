class AddAppraisalDateAppraisalPeriodToUsers < ActiveRecord::Migration
  def up
    add_column :users, :appraisal_date, :date
    add_column :users, :appraisal_period, :integer
    end

  def down
    remove_column :users, :appraisal_date, :date
    remove_column :users, :appraisal_period, :integer
  end
end
