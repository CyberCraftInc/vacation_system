require 'rails_helper'

RSpec.feature 'Manager creates a team', js: true do
  given(:user) { FactoryGirl.create(:user) }
  given(:team) { FactoryGirl.create(:team) }

  background do
    FactoryGirl.create(:team_role, user: user, team: team, role: 'manager')
    sign_in_with user.email, user.password
    click_on 'Teams'
  end

  context 'successfully, with valid input' do
    scenario 'name=Valiants' do
      team_name = 'Valiants'
      expect(page).to have_content('Sign out')
      expect(page).to     have_content(team.name)
      expect(page).not_to have_content(team_name)

      fill_in 'team-name', with: team_name
      click_button 'Add'

      expect(page).to     have_content(team.name)
      expect(page).to     have_content(team_name)
    end
  end

  context 'unsuccessfully, with not valid input' do
    scenario 'name=Ants' do
      team_name = 'Ants'
      expect(page).to have_content('Sign out')
      expect(page).to     have_content(team.name)
      expect(page).not_to have_content(team_name)

      fill_in 'team-name', with: team_name
      click_button 'Add'

      expect(page).to     have_content(team.name)
      expect(page).not_to have_content(team_name)
    end
  end
end
