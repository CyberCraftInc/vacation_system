require 'rails_helper'

RSpec.feature 'Member observes vacations summary', js: true do
  given(:team) { create(:team) }
  given(:user) { create(:user) }

  background do
    create(:team_role, user: user, team: team, role: 'member')
    sign_in_with user.email, user.password
    click_on 'Vacations'
  end

  context 'for regular vacations' do
    scenario 'successfully' do
      user_sees_simple_vacations_page

      show_button_title = 'Show detailed info'
      hide_button_title = 'Hide detailed info'
      message = 'Please select vacation type!'
      node = find 'div.new-vacation-request-form'

      expect(node).not_to have_content(show_button_title)
      expect(node).to     have_content(message)

      node.select 'regular', from: 'vacation-type'

      expect(node).not_to have_content(message)
      expect(node).not_to have_content(hide_button_title)
      expect(node).to     have_content(show_button_title)
      expect(node).to     have_css('div.extended', visible: :hidden)

      click_button show_button_title

      expect(node).not_to have_content(message)
      expect(node).to     have_css('div.extended', visible: :true)
      expect(node).to     have_css('table.table-condesed')

      table = node.find 'table.table-condesed'
      expect(table).to    have_content('Year')
      expect(table).to    have_content('Accumulated')
      expect(table).to    have_content('Requested')
      expect(table).to    have_content('Used')
      expect(table).to    have_content('Remaining')
      expect(table).to    have_content('Total')

      calendar_year_of_employment = user.employment_date.year
      expect(calendar_year_of_employment).to be_instance_of(2010.class)
      expect(calendar_year_of_employment).to be > 2010

      current_calendar_year = Date.today.year
      expect(current_calendar_year).to be_instance_of(2010.class)
      expect(current_calendar_year).to be > 2010
      expect(current_calendar_year).to be > calendar_year_of_employment

      number_of_rows = current_calendar_year - calendar_year_of_employment + 2
      expect(number_of_rows).to be > 0

      expect(table).to have_css('tbody tr', count: number_of_rows)
    end
  end
end
