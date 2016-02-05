require 'rails_helper'

RSpec.feature 'Member requests regular vacation', js: true do
  given(:team) { create(:team) }
  given(:user) { create(:user) }
  given(:start_date)  { '2015-01-01' }
  given(:end_date)    { '2015-01-14' }

  background do
    create(:team_role, user: user, team: team, role: 'member')
    sign_in_with user.email, user.password
    click_on 'Vacations'
  end

  context 'with valid input' do
    scenario 'successfully' do
      user_sees_simple_vacations_page

      expect(page).not_to have_content('Show detailed info')
      expect(page).to     have_content('Please select vacation type!')

      page.select 'regular', from: 'vacation-type'

      expect(page).to     have_content('Show detailed info')
      expect(page).not_to have_content('Please select vacation type!')

      fill_in 'from', with: start_date
      fill_in 'to',   with: end_date
      click_button 'Request'
      wait_for_ajax

      table = find 'table.vacation-requests'
      expect(table).to have_content(start_date)
      expect(table).to have_content(end_date)
    end
  end
end
