require 'rails_helper'

RSpec.describe SummaryController, type: :controller do
  let(:team) { create :team, :with_users, number_of_members: 1 }
  let(:manager) { team.team_roles.managers.first.user }
  let(:member)  { team.team_roles.members.first.user }
  let(:guest)   { team.team_roles.guests.first.user }
  let(:user)    { manager }
  let(:vacation) { create(:vacation_request, user: user) }

  ################################################################### GET #index
  describe 'GET #index' do
    let(:send_request) { get :index }

    context 'from authenticated user' do
      before do
        sign_in user
        vacation
        send_request
      end

      it 'responds with status code :ok (200)' do
        expect(response).to have_http_status(:ok)
      end

      it 'responds with proper data structure' do
        expect(response.body).not_to eq('')
      end
    end

    context 'from unauthenticated user' do
      it_should_behave_like 'unauthenticated request'
    end
  end
end
