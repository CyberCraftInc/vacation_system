require 'rails_helper'

RSpec.describe VacationRequest do
  it 'has a valid factory' do
    vacation_request = FactoryGirl.build(:vacation_request)

    expect(vacation_request).to be_valid
  end

  context 'as a brand new object' do
    let(:vacation_request) { VacationRequest.new }

    it { expect(vacation_request).to have_attributes duration: nil }
    it { expect(vacation_request).to have_attributes end: nil }
    it { expect(vacation_request).to have_attributes kind: 'planned' }
    it { expect(vacation_request).to have_attributes status: 'requested' }
    it { expect(vacation_request).to have_attributes start: nil }
    it { expect(vacation_request).to have_attributes user_id: nil }

    it { expect(vacation_request).not_to be_valid }
  end

  it 'allows to pass date in ISO 8601 format, that is, YYYY-MM-DD' do
    vacation_request = FactoryGirl.build(:vacation_request, start: '2017-05-01')

    expect(vacation_request).to be_valid
  end

  it 'allows to pass date as a Ruby Date object' do
    vacation_request = FactoryGirl.build(:vacation_request,
                                         start: Time.zone.today)

    expect(vacation_request).to be_valid
  end

  it 'does not allow to pass "duration" equal to 0' do
    vacation_request = FactoryGirl.build(:vacation_request, duration: 0)

    expect(vacation_request).not_to be_valid
  end

  it 'does not allow to pass "duration" as a float, like 0.5' do
    vacation_request = FactoryGirl.build(:vacation_request, duration: 5.5)

    expect(vacation_request).not_to be_valid
  end

  it 'does not allow to pass "end" as incorrect date when "status=used"' do
    vacation_request = FactoryGirl.build(:vacation_request, status: 'used')

    expect(vacation_request).not_to be_valid
  end

  describe '.requested_accepted_inprogress' do
    let(:user) { FactoryGirl.create :user, :with_vacations_of_all_statuses }

    it 'provides accordingly filtered list of vacation requests' do
      expect(user.vacation_requests.count).to be(6)
      expect(VacationRequest.requested_accepted_inprogress.count).to be(3)
    end
  end

  describe '.team_vacations' do
    let(:boy)   { FactoryGirl.create :user, :with_vacations_of_all_statuses }
    let(:girl)  { FactoryGirl.create :user, email: 'lady_in_red@i.ua' }
    let(:team)  { FactoryGirl.create :team }

    before do
      FactoryGirl.create :vacation_request, user: girl
      FactoryGirl.create :team_role, team: team, user: boy
      FactoryGirl.create :team_role, team: team, user: girl
    end

    it 'provides list of vacation requests for users of specified team' do
      expect(VacationRequest.team_vacations(team).length).to be(7)
    end
  end

  context 'validations' do
    it { should define_enum_for(:kind) }
    it { should define_enum_for(:status) }

    it { should validate_presence_of(:duration) }
    it { should validate_presence_of(:kind) }
    it { should validate_presence_of(:start) }
    it { should validate_presence_of(:status) }
    it { should validate_presence_of(:user) }
  end

  context 'associations' do
    it { should have_many(:approval_requests) }
    it { should belong_to(:user) }
  end
end
