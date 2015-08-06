require 'rails_helper'

RSpec.feature 'Member creates a team', js: true do
  given(:user) { FactoryGirl.create(:user) }
  given(:team) { FactoryGirl.create(:team) }

  background do
    FactoryGirl.create(:team_role, user: user, team: team, role: 'member')
    sign_in_with user.email, user.password
    click_on 'Teams'
  end

  scenario 'and fails due to authorization issue' do
    expect(page).to have_content('Sign out')
    expect(page).to     have_content(team.name)
    expect(page).not_to have_selector('input[name="team-name"]')
    expect(page).not_to have_selector('button[name="add"]')
  end
end
