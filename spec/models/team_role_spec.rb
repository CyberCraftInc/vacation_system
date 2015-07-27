require 'rails_helper'

RSpec.describe TeamRole do
  it 'has a valid factory' do
    team_role = FactoryGirl.build(:team_role)
    expect(team_role).to be_valid
  end

  context 'as a new bare object' do
    let(:team_role) { TeamRole.new }

    it { expect(team_role).to have_attributes role: 'guest' }
    it { expect(team_role).to have_attributes user_id: nil }
    it { expect(team_role).to have_attributes team_id: nil }

    it { expect(team_role).not_to be_valid }
  end

  context 'as a new valid object' do
    let(:team_role) { FactoryGirl.build(:team_role) }

    it { expect(team_role).to     have_attributes role: 'member' }
    it { expect(team_role).not_to have_attributes user_id: nil }
    it { expect(team_role).not_to have_attributes team_id: nil }

    it { expect(team_role).to be_valid }
  end

  it 'does not allow records with duplicate team_id and user_id' do
    team = FactoryGirl.create(:team)
    user = FactoryGirl.create(:user)
    FactoryGirl.create(:team_role, team: team, user: user, role: 'member')

    expect { create(:team_role, team: team, user: user, role: 'guest') }
      .to raise_exception(ActiveRecord::RecordInvalid)
  end

  context 'validations' do
    it { should define_enum_for(:role) }

    it { should validate_presence_of(:role) }
    it { should validate_presence_of(:user_id) }
    it { should validate_presence_of(:team_id) }
  end

  context 'associations' do
    it { should belong_to(:user) }
    it { should belong_to(:team) }
  end
end
