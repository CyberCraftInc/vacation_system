require 'rails_helper'

RSpec.feature 'Manager updates team', js: true do
  given(:user) { FactoryGirl.create(:user) }
  given(:team)          { FactoryGirl.create(:team) }
  given(:another_team)  { FactoryGirl.create(:team) }

  context 'with "manager" role in the team' do
    background do
      create(:team_role, user: user, team: team, role: 'manager')
      sign_in_with user.email, user.password
      click_on 'Teams'
    end

    context 'successfully, with valid input' do
      scenario 'name=Valiants' do
        team_name = 'Valiants'
        expect(page).to have_content('Sign out')
        expect(page).to     have_content(team.name)
        expect(page).not_to have_content(team_name)

        page.find('li', text: team.name).double_click
        field = page.find(:css, '.editing input')
        field.set team_name
        field.native.send_key :Enter

        expect(page).not_to have_content(team.name)
        expect(page).to     have_content(team_name)
      end
    end

    context 'unsuccessfully, with not valid input' do
      scenario 'name=Ants' do
        team_name = 'Ants'
        expect(page).to have_content('Sign out')
        expect(page).to     have_content(team.name)
        expect(page).not_to have_content(team_name)

        page.find('li', text: team.name).double_click
        field = page.find(:css, '.editing input')
        field.set team_name
        field.native.send_key :Enter

        expect(page).to     have_content(team.name)
        expect(page).not_to have_content(team_name)
      end
    end
  end

  context 'with "manager" role in another team, but not the subject one' do
    background do
      team
      create(:team_role, user: user, team: another_team, role: 'manager')
      sign_in_with user.email, user.password
      click_on 'Teams'
    end

    context 'successfully, with valid input' do
      scenario 'name=Valiants' do
        team_name = 'Valiants'
        expect(page).to have_content('Sign out')
        expect(page).to     have_content(another_team.name)
        expect(page).to     have_content(team.name)
        expect(page).not_to have_content(team_name)

        page.find('li', text: team.name).double_click
        field = page.find(:css, '.editing input')
        field.set team_name
        field.native.send_key :Enter

        expect(page).to     have_content(another_team.name)
        expect(page).not_to have_content(team.name)
        expect(page).to     have_content(team_name)
      end
    end

    context 'unsuccessfully, with not valid input' do
      scenario 'name=Ants' do
        team_name = 'Ants'
        expect(page).to have_content('Sign out')
        expect(page).to     have_content(team.name)
        expect(page).not_to have_content(team_name)

        page.find('li', text: team.name).double_click
        field = page.find(:css, '.editing input')
        field.set team_name
        field.native.send_key :Enter

        expect(page).to     have_content(team.name)
        expect(page).not_to have_content(team_name)
      end
    end
  end
end
