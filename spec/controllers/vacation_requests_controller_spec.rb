require 'rails_helper'

RSpec.describe VacationRequestsController do
  let(:team) { create :team, :with_users, number_of_members: 1 }
  let(:manager) { team.team_roles.managers.first.user }
  let(:member)  { team.team_roles.members.first.user }
  let(:guest)   { team.team_roles.guests.first.user }
  let(:user)    { manager }
  let(:vacation_request) { create(:vacation_request) }

  ################################################################# POST #create
  describe 'POST #create' do
    let(:send_request)  { post :create, params }
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
        it_should_behave_like 'unauthorized request'

        it 'should not add any record to DB' do
          expect { send_request }.not_to change(VacationRequest, :count)
        end
      end
    end
  end
end
