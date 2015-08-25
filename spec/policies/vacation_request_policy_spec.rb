require 'rails_helper'

describe VacationRequestPolicy do
  let(:team) { create(:team, :with_users, number_of_members: 1) }
  let(:manager) { team.team_roles.managers.first.user }
  let(:member)  { team.team_roles.members.first.user }
  let(:guest)   { team.team_roles.guests.first.user }
  let(:vacation_request) { create(:vacation_request) }

  subject { VacationRequestPolicy }

  permissions :create?, :update?, :destroy? do
    context 'for user of any team' do
      context 'with role=manager' do
        it 'grants access' do
          expect(subject).to permit(manager, vacation_request)
        end
      end
      context 'with role=member' do
        it 'grants access' do
          expect(subject).to permit(member, vacation_request)
        end
      end
      context 'with role=guest' do
        it 'denies access' do
          expect(subject).not_to permit(guest, vacation_request)
        end
      end
    end
  end
end
