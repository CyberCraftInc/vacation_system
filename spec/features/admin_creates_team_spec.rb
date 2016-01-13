require 'rails_helper'

RSpec.feature 'Admin creates a team', js: true do
  given(:user) { create(:user) }
  given(:team) { create(:team) }

  background do
    create(:team_role, user: user, team: team, role: 'admin')
    create(:team_role, user: user, team: team, role: 'member')
    sign_in_with user.email, user.password
    page.save_screenshot('tmp/0.png')
    p page.current_url
    click_on 'Teams'
    p page.current_url
  end

  context 'successfully, with valid input' do
    scenario 'name=Valiants' do
      team_name = 'Valiants'
      expect(page).to     have_content('Sign out')
      expect(page).to     have_content(team.name)
      expect(page).not_to have_content(team_name)

      fill_in 'new-team-name', with: team_name
      page.save_screenshot('tmp/1.png')
      click_button 'Create'

      expect(page).to     have_content(team.name)
      expect(page).to     have_content(team_name)
      page.save_screenshot('tmp/2.png')
    end
  end

  context 'unsuccessfully, with not valid input' do
    scenario 'name=Ants' do
      team_name = 'Ants'
      expect(page).to have_content('Sign out')
      expect(page).to     have_content(team.name)
      expect(page).not_to have_content(team_name)

      fill_in 'new-team-name', with: team_name
      click_button 'Create'

      expect(page).to     have_content(team.name)
      expect(page).not_to have_content(team_name)
    end
  end
end
