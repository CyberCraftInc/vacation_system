require 'rails_helper'

describe TeamPolicy do
  let(:team)          { create(:team, :with_users, number_of_members: 1) }
  let(:another_team)  { create(:team, :with_users, number_of_members: 1) }

  subject { TeamPolicy }

  permissions :create?, :update?, :destroy? do
    context 'for the team members' do
      let(:manager) { team.team_roles.managers.first.user }
      let(:member)  { team.team_roles.members.first.user }
      let(:guest)   { team.team_roles.guests.first.user }

      context 'with role=manager' do
        it 'grants access' do
          expect(subject).to permit(manager, team)
        end
      end
      context 'with role=member, or role=guest' do
        it 'denies access' do
          expect(subject).not_to permit(member, team)
          expect(subject).not_to permit(guest, team)
        end
      end
    end

    context 'for members of another team' do
      let(:manager) { another_team.team_roles.managers.first.user }
      let(:member)  { another_team.team_roles.members.first.user }
      let(:guest)   { another_team.team_roles.guests.first.user }

      context 'with role=manager' do
        it 'grants access' do
          expect(subject).to permit(manager, team)
        end
      end
      context 'with role=member, or role=guest' do
        it 'denies access' do
          expect(subject).not_to permit(member, team)
          expect(subject).not_to permit(guest, team)
        end
      end
    end
  end
end
