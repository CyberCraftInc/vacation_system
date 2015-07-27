require 'rails_helper'

RSpec.describe Team do
  it 'has a valid factory' do
    team = FactoryGirl.build(:team)

    expect(team).to be_valid
  end

  context 'as a new bare object' do
    let(:team) { Team.new }

    it { expect(team).not_to be_valid }
  end

  context 'validations' do
    it { should validate_presence_of(:name) }
    it do
      should validate_length_of(:name)
        .is_at_least(5)
        .is_at_most(35)
    end
  end

  context 'associations' do
    it { should have_many(:team_roles) }
    it { should have_many(:users).through(:team_roles) }
  end
end
