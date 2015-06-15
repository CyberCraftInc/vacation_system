class ChangeRoleTypeInTeamRoles < ActiveRecord::Migration
  def change
    rename_column :team_roles, :role, :role_id
    change_column :team_roles, :role_id, :integer, references: :roles
  end
end
