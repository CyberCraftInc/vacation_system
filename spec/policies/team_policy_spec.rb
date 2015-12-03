require 'rails_helper'

describe TeamPolicy do
  let(:team)    { create(:team, :compact) }
  let(:admin)   { team.team_roles.admins.first.user }
  let(:manager) { team.team_roles.managers.first.user }
  let(:member)  { team.team_roles.members.first.user }
  let(:guest)   { team.team_roles.guests.first.user }
  let(:unregistred) { nil }

  subject { TeamPolicy }

  permissions :index? do
    context 'for user with role=admin' do
      it 'grants access' do
        expect(subject).to permit(admin, team)
      end
    end
    context 'for user with role=manager' do
      it 'grants access' do
        expect(subject).to permit(manager, team)
      end
    end
    context 'for user with role=member' do
      it 'grants access' do
        expect(subject).to permit(member, team)
      end
    end
    context 'for user with role=guest' do
      it 'grants access' do
        expect(subject).to permit(guest, team)
      end
    end
    context 'for not registered user' do
      it 'denies access' do
        expect(subject).not_to permit(unregistred, team)
      end
    end
  end

  permissions :create?, :update?, :destroy? do
    context 'for user with role=admin' do
      it 'grants access' do
        expect(subject).to permit(admin, team)
      end
    end
    context 'for user with role=manager' do
      it 'denies access' do
        expect(subject).not_to permit(manager, team)
      end
    end
    context 'for user with role=member' do
      it 'denies access' do
        expect(subject).not_to permit(member, team)
      end
    end
    context 'for user with role=guest' do
      it 'denies access' do
        expect(subject).not_to permit(guest, team)
      end
    end
    context 'for not registered user' do
      it 'denies access' do
        expect(subject).not_to permit(unregistred, team)
      end
    end
  end
end
