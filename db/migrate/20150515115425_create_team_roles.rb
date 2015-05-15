class CreateTeamRoles < ActiveRecord::Migration
  def change
    create_table :team_roles do |t|
      t.string :role
      t.references :holder, polymorphic: true, index: true

      t.timestamps null: false
    end
  end
end
