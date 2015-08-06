require 'rails_helper'

RSpec.feature 'Manager deletes team', js: true do
  given(:user) { FactoryGirl.create(:user) }
  given(:team)          { FactoryGirl.create(:team) }
  given(:another_team)  { FactoryGirl.create(:team) }

  context 'with "manager" role in the team' do
    background do
      another_team
      create(:team_role, user: user, team: team, role: 'manager')
      sign_in_with user.email, user.password
      click_on 'Teams'
    end

    scenario 'successfully' do
      expect(page).to have_content('Sign out')
      expect(page).to     have_content(team.name)
      expect(page).to     have_content(another_team.name)

      node = page.find('li', text: team.name)
      # Provides action related control
      expect(node).to     have_css('input[type=button]')
      node.find(:button, 'Delete').click

      expect(page).not_to have_content(team.name)
      expect(page).to     have_content(another_team.name)
    end
  end

  context 'with "manager" role in another team, but not the subject one' do
    background do
      team
      create(:team_role, user: user, team: another_team, role: 'manager')
      sign_in_with user.email, user.password
      click_on 'Teams'
    end

    scenario 'successfully' do
      expect(page).to have_content('Sign out')
      expect(page).to     have_content(team.name)
      expect(page).to     have_content(another_team.name)

      node = page.find('li', text: team.name)
      # Provides action related control
      expect(node).to     have_css('input[type=button]')
      node.find(:button, 'Delete').click

      expect(page).not_to have_content(team.name)
      expect(page).to     have_content(another_team.name)
    end
  end
end
