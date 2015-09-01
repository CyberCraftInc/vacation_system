require 'rails_helper'

RSpec.feature 'User signs in' do
  given(:user) { FactoryGirl.create(:user) }
  scenario 'with valid email and password' do
    sign_in_with user.email, user.password

    expect(page).to have_content('Sign out')
  end

  scenario 'with invalid email, and fails' do
    sign_in_with 'invalid_email', user.password

    expect(page).to have_content('Sign in')
  end

  scenario 'with blank password, and fails' do
    sign_in_with user.email, ''

    expect(page).to have_content('Sign in')
  end

  def sign_in_with(email, password)
    visit new_user_session_path
    fill_in 'Email', with: email
    fill_in 'Password', with: password
    click_button 'Log in'
  end
end
