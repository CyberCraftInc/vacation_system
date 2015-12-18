require 'rails_helper'

RSpec.feature 'Guest deletes team', js: true do
  given(:user) { create(:user) }
  given(:team) { create(:team) }

  background do
    create(:team_role, user: user, team: team, role: 'guest')
    sign_in_with user.email, user.password
    click_on 'Teams'
  end

  scenario 'unsuccessfully, due to authorization issue' do
    expect(page).to     have_content('Sign out')
    expect(page).not_to have_content('Create New Team')
    expect(page).not_to have_content(team.name)
  end
end
