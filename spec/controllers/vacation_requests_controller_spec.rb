require 'rails_helper'

RSpec.shared_examples 'request with conflict' do
  it 'should respond with status code :conflict (409)' do
    send_request
    expect(response).to have_http_status(:conflict)
  end

  it 'should not change vacation request status' do
    expect { send_request }
      .not_to change { VacationRequest.find_by(id: vacation_request.id).status }
  end
end

RSpec.shared_examples 'pretty request' do
  it 'should respond with status code :ok (200)' do
    send_request
    expect(response).to have_http_status(:ok)
  end

  it 'should set vacation request status to "cancelled"' do
    expect { send_request }
      .to change { VacationRequest.find_by(id: vacation_request.id).status }
      .to('cancelled')
  end
end

RSpec.describe VacationRequestsController do
  let(:team) { create :team, :with_users, number_of_members: 1 }
  let(:manager) { team.team_roles.managers.first.user }
  let(:member)  { team.team_roles.members.first.user }
  let(:guest)   { team.team_roles.guests.first.user }
  let(:user)    { manager }
  let(:vacation_request) { create(:vacation_request, user: user) }

  ################################################################# POST #create
  describe 'POST #create' do
    let(:send_request) { post :create, params }
    let(:params) { Hash[format: :json, vacation_request: json_data] }
    let(:json_data) { YAML.load(vacation_request.to_json) }
    let(:vacation_request) { build(:vacation_request) }

    context 'from authenticated user with manager role' do
      before { sign_in user }

      context 'who has roles only in one team' do
        context 'with correct data' do
          it 'should respond with status code :created (201)' do
            send_request
            expect(response).to have_http_status(:created)
          end

          it 'should add correct vacation request record to DB' do
            expect { send_request }.to change(VacationRequest, :count).by(+1)

            selectors = { start_date: vacation_request.start_date }
            new_vacation_request = VacationRequest.find_by(selectors)
            expect(new_vacation_request.status).not_to be_nil
            expect(new_vacation_request.status).to eq('accepted')
          end

          it 'should not add any approval request record to DB' do
            expect { send_request }.not_to change(ApprovalRequest, :count)
          end
        end

        context 'with incorrect data' do
          let(:vacation_request) { build(:vacation_request, :invalid) }

          it 'should respond with status code :unprocessable_entity (422)' do
            send_request
            expect(response).to have_http_status(:unprocessable_entity)
          end

          it 'should contain error message as JSON data in response body' do
            send_request
            expect(response.body).to have_json_attribute(:errors)
          end

          it 'should not add any record to DB' do
            expect { send_request }.not_to change(VacationRequest, :count)
            expect { send_request }.not_to change(ApprovalRequest, :count)
          end
        end
      end
    end

    context 'from authenticated user with member role' do
      let(:user) { member }

      before { sign_in user }

      context 'who has roles only in one team' do
        context 'with correct data' do
          it 'should respond with status code :created (201)' do
            send_request
            expect(response).to have_http_status(:created)
          end

          it 'should add correct vacation request record to DB' do
            expect { send_request }.to change(VacationRequest, :count).by(+1)

            selectors = { start_date: vacation_request.start_date }
            expect(VacationRequest.find_by(selectors)).not_to be_nil
          end

          it 'should add correct approval request record to DB' do
            expect { send_request }.to change(ApprovalRequest, :count).by(+1)

            selectors = { start_date: vacation_request.start_date }
            new_vacation_request = VacationRequest.find_by(selectors)
            expect(new_vacation_request.status).not_to be_nil
            expect(new_vacation_request.status).to eq('requested')
            expect(new_vacation_request.planned_end_date).not_to be_nil

            selectors = { vacation_request_id: new_vacation_request.id }
            expect(ApprovalRequest.find_by(selectors)).not_to be_nil
          end
        end

        context 'with incorrect data' do
          let(:vacation_request) { build(:vacation_request, :invalid) }

          it 'should respond with status code :unprocessable_entity (422)' do
            send_request
            expect(response).to have_http_status(:unprocessable_entity)
          end

          it 'should contain error message as JSON data in response body' do
            send_request
            expect(response.body).to have_json_attribute(:errors)
          end

          it 'should not add any record to DB' do
            expect { send_request }.not_to change(VacationRequest, :count)
          end
        end
      end
    end

    context 'from authenticated user with guest role' do
      let(:user) { guest }

      before { sign_in user }

      context 'who has roles only in one team,' do
        context 'with correct data' do
          it 'should respond with status code :forbidden (403)' do
            send_request
            expect(response).to have_http_status(:forbidden)
          end

          it 'should not add any vacation request record to DB' do
            expect { send_request }.not_to change(VacationRequest, :count)
          end

          it 'should not add any approval request record to DB' do
            expect { send_request }.not_to change(ApprovalRequest, :count)
          end
        end

        context 'with incorrect data' do
          let(:vacation_request) { build(:vacation_request, :invalid) }

          it 'should respond with status code :forbidden (403)' do
            send_request
            expect(response).to have_http_status(:forbidden)
          end

          it 'should not add any vacation request record to DB' do
            expect { send_request }.not_to change(VacationRequest, :count)
          end

          it 'should not add any approval request record to DB' do
            expect { send_request }.not_to change(ApprovalRequest, :count)
          end
        end
      end
    end

    context 'from unauthenticated user' do
      context 'with correct data' do
        it_should_behave_like 'unauthenticated request'

        it 'should not add any record to DB' do
          expect { send_request }.not_to change(VacationRequest, :count)
        end
      end
    end
  end

  ################################################################## GET #cancel
  describe 'GET #cancel' do
    let(:team) do
      create :team, :with_users, number_of_managers: 2, number_of_members: 1
    end
    let(:send_request) { get :cancel, params }
    let(:params) { Hash[format: :json, id: vacation_request.id] }

    context 'from authenticated user' do
      before { sign_in user }

      context 'with ID of not existing vacation request' do
        let(:params) { Hash[format: :json, id: (vacation_request.id - 1)] }

        it 'should respond with status code :not_found (404)' do
          send_request
          expect(response).to have_http_status(:not_found)
        end
      end

      context 'with manager role' do
        context 'who owns the vacation request' do
          let(:vacation_request) do
            create(:vacation_request, :with_approval_requests, user: user)
          end

          context 'when vacation request status is set to "requested"' do
            it 'should delete all associated approval requests' do
              expect { send_request }
                .to change { vacation_request.approval_requests.count }
                .from(1).to(0)
            end

            it_should_behave_like 'pretty request'
          end

          context 'when vacation request status is set to "accepted"' do
            let(:vacation_request) do
              create(:vacation_request, user: user, status: 'accepted')
            end

            it_should_behave_like 'pretty request'
          end
        end

        context 'who does not own the vacation request' do
          let(:vacation_request) do
            create(:vacation_request, :with_approval_requests, user: member)
          end

          it 'should not change vacation request status' do
            id = vacation_request.id

            expect { send_request }
              .not_to change { VacationRequest.find_by(id: id).status }
          end

          it 'should not delete associated approval requests' do
            expect { send_request }
              .not_to change { vacation_request.approval_requests.count }
          end

          it_should_behave_like 'unauthorized request'
        end
      end

      context 'with member role' do
        let(:user) { member }
        context 'who owns the vacation request' do
          let(:vacation_request) do
            create(:vacation_request, :with_approval_requests, user: user)
          end

          context 'when vacation request status is set to "requested"' do
            it 'should delete all associated approval requests' do
              expect { send_request }
                .to change { vacation_request.approval_requests.count }
                .from(2).to(0)
            end

            it_should_behave_like 'pretty request'
          end

          context 'when vacation request status is set to "accepted"' do
            let(:vacation_request) do
              create(:vacation_request, user: user, status: 'accepted')
            end

            it_should_behave_like 'pretty request'
          end
        end

        context 'who does not own the vacation request' do
          let(:vacation_request) do
            create(:vacation_request, :with_approval_requests, user: manager)
          end

          it 'should not change vacation request status' do
            id = vacation_request.id

            expect { send_request }
              .not_to change { VacationRequest.find_by(id: id).status }
          end

          it 'should not delete associated approval requests' do
            expect { send_request }
              .not_to change { vacation_request.approval_requests.count }
          end

          it_should_behave_like 'unauthorized request'
        end
      end

      context 'with guest role' do
        let(:user) { guest }
        context 'who owns the vacation request' do
          let(:vacation_request) do
            create(:vacation_request, :with_approval_requests, user: user)
          end

          it 'should not change vacation request status' do
            id = vacation_request.id

            expect { send_request }
              .not_to change { VacationRequest.find_by(id: id).status }
          end

          it_should_behave_like 'unauthorized request'
        end
      end

      context 'when vacation request status is set to "declined"' do
        let(:vacation_request) do
          create(:vacation_request, user: user, status: 'declined')
        end

        it_should_behave_like 'request with conflict'
      end

      context 'when vacation request status is set to "cancelled"' do
        let(:vacation_request) do
          create(:vacation_request, user: user, status: 'cancelled')
        end

        it_should_behave_like 'request with conflict'
      end

      context 'when vacation request status is set to "inprogress"' do
        let(:vacation_request) do
          create(:vacation_request, user: user, status: 'inprogress')
        end

        it_should_behave_like 'request with conflict'
      end

      context 'when vacation request status is set to "used"' do
        let(:vacation_request) do
          create(:vacation_request, user: user, status: 'used')
        end

        it_should_behave_like 'request with conflict'
      end
    end

    context 'from unauthenticated user' do
      it_should_behave_like 'unauthenticated request'

      it 'should not change vacation request status' do
        id = vacation_request.id
        expect { send_request }
          .not_to change { VacationRequest.find_by(id: id).status }
      end
    end
  end
end
