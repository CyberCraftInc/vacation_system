require 'rails_helper'

RSpec.feature 'Member updates team', js: true do
  given(:user) { FactoryGirl.create(:user) }
  given(:team)          { FactoryGirl.create(:team) }
  given(:another_team)  { FactoryGirl.create(:team) }

  context 'with "member" role in the team' do
    background do
      create(:team_role, user: user, team: team, role: 'member')
      sign_in_with user.email, user.password
      click_on 'Teams'
    end

    scenario 'unsuccessfully, due to authorization' do
      expect(page).to have_content('Sign out')
      expect(page).to     have_content(team.name)

      page.find('li', text: team.name).double_click

      expect(page).not_to have_css('.editing input')
      expect(page).to     have_content(team.name)
    end
  end

  context 'with "member" role in another team, but not the subject one' do
    background do
      team
      create(:team_role, user: user, team: another_team, role: 'member')
      sign_in_with user.email, user.password
      click_on 'Teams'
    end

    scenario 'unsuccessfully, due to authorization' do
      expect(page).to have_content('Sign out')
      expect(page).to     have_content(team.name)

      page.find('li', text: team.name).double_click

      expect(page).not_to have_css('.editing input')
      expect(page).to     have_content(team.name)
    end
  end
end
