require 'rails_helper'

describe UserPolicy do
  let(:team) { create(:team, :compact) }

  subject { UserPolicy }

  permissions :approval_requests?, :requested_vacations? do
    context 'for the team members' do
      let(:manager) { team.team_roles.managers.first.user }
      let(:member)  { team.team_roles.members.first.user }
      let(:guest)   { team.team_roles.guests.first.user }

      context 'with role=manager' do
        it 'grants access' do
          expect(subject).to permit(manager)
        end
      end

      context 'with role=member' do
        it 'grants access' do
          expect(subject).to permit(member)
        end
      end

      context 'role=guest' do
        it 'denies access' do
          expect(subject).not_to permit(guest)
        end
      end
    end
  end
end
