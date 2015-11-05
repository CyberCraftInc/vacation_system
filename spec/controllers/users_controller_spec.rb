require 'rails_helper'

RSpec.describe UsersController do
  let(:team) { create(:team, :compact) }
  let(:manager) { team.team_roles.managers.first.user }
  let(:member)  { team.team_roles.members.first.user }
  let(:guest)   { team.team_roles.guests.first.user }
  let(:user)    { manager }

  shared_examples 'empty approval_requests request' do
    it 'should not throw an exception' do
      expect { send_request }.not_to raise_error
    end

    it 'should respond with status code :ok (200)' do
      send_request
      expect(response).to have_http_status(:ok)
    end

    it 'should respond with proper JSON data structure' do
      send_request
      expected = []
      expect(response.body).to have_json_attributes(expected)
    end
  end

  shared_examples 'pretty approval_requests request' do
    it 'should not throw an exception' do
      expect { send_request }.not_to raise_error
    end

    it 'should respond with status code :ok (200)' do
      send_request
      expect(response).to have_http_status(:ok)
    end

    it 'should respond with proper JSON data structure' do
      send_request
      expected = %w(id kind start_date end_date first_name last_name user_id)
      expect(response.body).to have_json_attributes(expected)
    end
  end

  ################################################################### GET #index
  describe 'GET #index, format: :json' do
    pending
  end

  ####################################################### GET #approval_requests
  describe 'GET #approval_requests, format: :json' do
    let(:send_request) { get :approval_requests, params }
    let(:params) { Hash[format: :json, id: user.id] }

    context 'from unauthenticated user' do
      before { send_request }

      it_should_behave_like 'unauthenticated request'
    end

    context 'from authenticated user' do
      before { sign_in user }

      context 'with manager role' do
        let(:user) { manager }

        context 'without any assigned approval request' do
          it_should_behave_like 'empty approval_requests request'
        end

        context 'with an assigned approval request' do
          let(:vacation) do
            create(:vacation_request, user: member)
          end

          before do
            ApprovalRequest.create(manager_id: user.id,
                                   vacation_request_id: vacation.id)
          end

          it_should_behave_like 'pretty approval_requests request'
        end
      end
    end
  end
end
