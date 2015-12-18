require 'rails_helper'

RSpec.feature 'Member creates a team', js: true do
  given(:user) { create(:user) }
  given(:team) { create(:team) }

  background do
    create(:team_role, user: user, team: team, role: 'member')
    sign_in_with user.email, user.password
    click_on 'Teams'
  end

  scenario 'and fails due to authorization issue' do
    expect(page).to     have_content('Sign out')
    expect(page).to     have_content(team.name)
    expect(page).not_to have_content('Create New Team')
    expect(page).not_to have_selector('input[name="new-team-name"]')
    expect(page).not_to have_selector('button[name="create"]')
  end
end
