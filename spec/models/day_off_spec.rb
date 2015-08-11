require 'rails_helper'

RSpec.describe DayOff do
  it 'has a valid factory' do
    day_off = FactoryGirl.build(:day_off)

    expect(day_off).to be_valid
  end

  context 'as a brand new object' do
    let(:day_off) { DayOff.new }

    it { expect(day_off).to have_attributes description: nil }
    it { expect(day_off).to have_attributes duration: nil }
    it { expect(day_off).to have_attributes start: nil }

    it { expect(day_off).not_to be_valid }
  end

  context 'validations' do
    it { should validate_presence_of(:description) }
    it do
      should validate_length_of(:description)
        .is_at_least(7)
        .is_at_most(25)
    end

    it { should validate_presence_of(:duration) }
    it do
      should validate_numericality_of(:duration)
        .only_integer
        .is_greater_than(0)
        .is_less_than(5)
    end

    it { should validate_presence_of(:start) }
    it do
      should validate_inclusion_of(:start)
        .in_range(Date.new(2015, 01, 01)..Date.new(2115, 01, 01))
    end
  end
end
