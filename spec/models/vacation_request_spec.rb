require 'rails_helper'

RSpec.describe VacationRequest do
  it 'has a valid factory' do
    vacation_request = FactoryGirl.build(:vacation_request)

    expect(vacation_request).to be_valid
  end

  context 'as a brand new object' do
    let(:vacation_request) { VacationRequest.new }

    it { expect(vacation_request).to have_attributes kind: 'planned' }
    it { expect(vacation_request).to have_attributes status: 'requested' }
    it { expect(vacation_request).to have_attributes actual_end_date: nil }
    it { expect(vacation_request).to have_attributes planned_end_date: nil }
    it { expect(vacation_request).to have_attributes start_date: nil }
    it { expect(vacation_request).to have_attributes user_id: nil }

    it { expect(vacation_request).not_to be_valid }
  end

  it 'allows to pass date in ISO 8601 format, that is, YYYY-MM-DD' do
    vacation_request = build(:vacation_request, start_date: '2017-05-01')

    expect(vacation_request).to be_valid
  end

  it 'allows to pass date as a Ruby Date object' do
    vacation_request = build(:vacation_request)
    record = YAML.load(vacation_request.to_json)

    expect { VacationRequest.create(record) }.not_to raise_exception
  end

  describe 'with "status=used"' do
    it 'does not allow to pass "actual_end_date" as incorrect date string' do
      vacation_request = build(:vacation_request, :invalid, status: 'used')

      expect(vacation_request).not_to be_valid
    end
  end

  describe '.duration' do
    pending 'To be implemented'
    # let(:user) { create :user, :with_vacations_of_all_statuses }
    #
    # it 'provides accordingly filtered list of vacation requests' do
    #   expect(user.vacation_requests.count).to eq(6)
    #   expect(VacationRequest.requested_accepted_inprogress.count).to eq(3)
    # end
  end

  describe '.requested_accepted_inprogress' do
    let(:user) { create :user, :with_vacations_of_all_statuses }

    it 'provides accordingly filtered list of vacation requests' do
      expect(user.vacation_requests.count).to eq(6)
      expect(VacationRequest.requested_accepted_inprogress.count).to eq(3)
    end
  end

  describe '.team_vacations' do
    let(:boy)   { create :user, :with_vacations_of_all_statuses }
    let(:girl)  { create :user, email: 'lady_in_red@i.ua' }
    let(:team)  { create :team }

    before do
      create :vacation_request, user: girl
      create :team_role, team: team, user: boy
      create :team_role, team: team, user: girl
    end

    it 'provides list of vacation requests for users of specified team' do
      expect(VacationRequest.team_vacations(team).length).to eq(7)
    end
  end

  context 'validations' do
    it { should define_enum_for(:kind) }
    it { should define_enum_for(:status) }

    it { should validate_presence_of(:kind) }
    it { should validate_presence_of(:start_date) }
    it { should validate_presence_of(:status) }
    it { should validate_presence_of(:user) }
  end

  context 'associations' do
    it { should have_many(:approval_requests) }
    it { should belong_to(:user) }
  end
end
