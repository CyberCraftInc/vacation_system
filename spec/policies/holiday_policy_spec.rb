require 'rails_helper'

describe HolidayPolicy do
  let(:team)  { create(:team, :with_users, number_of_members: 1) }
  let(:holiday)  { create(:holiday) }

  subject { HolidayPolicy }

  permissions :create?, :update?, :destroy? do
    let(:manager) { team.team_roles.managers.first.user }
    let(:member)  { team.team_roles.members.first.user }
    let(:guest)   { team.team_roles.guests.first.user }

    context 'for user of any team' do
      context 'with role=manager' do
        it 'grants access' do
          expect(subject).to permit(manager, holiday)
        end
      end
      context 'with role=member, or role=guest' do
        it 'denies access' do
          expect(subject).not_to permit(member, holiday)
          expect(subject).not_to permit(guest, holiday)
        end
      end
    end
  end
end
