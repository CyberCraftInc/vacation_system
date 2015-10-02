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
    it { expect(vacation_request).to have_attributes planned_end_date: nil }
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

  it 'destroys all the records of dependant models' do
    expect(VacationRequest.count).to eq(0)
    expect(ApprovalRequest.count).to eq(0)

    team = create(:team, :with_users, number_of_members: 1)
    member = team.team_roles.members.first.user
    manager = team.team_roles.managers.first.user
    vacation_request = build(:vacation_request)
    attrs = vacation_request.attributes.except('id')
    vacation_request = member.vacation_requests.create(attrs)
    vacation_request.approval_requests.create(manager_id: manager.id)

    expect(VacationRequest.count).to eq(1)
    expect(ApprovalRequest.count).to eq(1)
    expect(vacation_request.approval_requests.count).to eq(1)

    expect { vacation_request.destroy }.not_to raise_exception

    expect(VacationRequest.count).to eq(0)
    expect(ApprovalRequest.count).to eq(0)
  end

  describe 'with "status=used"' do
    it 'does not allow to pass "planned_end_date" as incorrect date string' do
      vacation_request = build(:vacation_request, :invalid, status: 'used')

      expect(vacation_request).not_to be_valid
    end
  end

  describe '.cannot_intersect_with_other_vacations' do
    let(:user) { FactoryGirl.create(:user) }
    let(:another_user) { FactoryGirl.create(:user) }
    let(:vacation_request) { FactoryGirl.build(:vacation_request) }

    before do
      vacation_request.start_date        = '2015-09-01'
      vacation_request.planned_end_date  = '2015-09-21'
      vacation_request.actual_end_date   = vacation_request.planned_end_date
      vacation_request.user = user
      vacation_request.validate
    end

    describe 'for the very first vacation request' do
      it 'does not set any errors' do
        expect(vacation_request.errors).to be_empty
        expect(vacation_request).to be_valid
      end
    end

    context 'when user has other vacation requests' do
      describe 'without intersections' do
        before do
          create(:vacation_request,
                 user: user,
                 start_date: '2015-08-22', planned_end_date: '2015-08-30')
          create(:vacation_request,
                 user: user,
                 start_date: '2015-09-22', planned_end_date: '2015-09-25')

          vacation_request.validate
        end

        it 'does not set any errors' do
          expect(vacation_request.errors).to be_empty
          expect(vacation_request).to be_valid
        end
      end

      describe 'with intersections on start bound' do
        before do
          create(:vacation_request,
                 user: user,
                 start_date: '2015-08-22', planned_end_date: '2015-09-01')

          vacation_request.validate
        end

        it 'sets error' do
          expect(vacation_request.errors).not_to be_empty
          expect(vacation_request).not_to be_valid
        end
      end

      describe 'with intersections on end bound' do
        before do
          create(:vacation_request,
                 user: user,
                 start_date: '2015-09-21', planned_end_date: '2015-09-25')

          vacation_request.validate
        end

        it 'sets error' do
          expect(vacation_request.errors).not_to be_empty
          expect(vacation_request).not_to be_valid
        end
      end

      describe 'with intersections on both bounds' do
        before do
          create(:vacation_request,
                 user: user,
                 start_date: '2015-08-22', planned_end_date: '2015-09-01')
          create(:vacation_request,
                 user: user,
                 start_date: '2015-09-21', planned_end_date: '2015-09-25')

          vacation_request.validate
        end

        it 'sets error' do
          expect(vacation_request.errors).not_to be_empty
          expect(vacation_request).not_to be_valid
        end
      end

      describe 'with inner intersection' do
        before do
          create(:vacation_request,
                 user: user,
                 start_date: '2015-09-05', planned_end_date: '2015-09-15')

          vacation_request.validate
        end

        it 'sets error' do
          expect(vacation_request.errors).not_to be_empty
          expect(vacation_request).not_to be_valid
        end
      end

      describe 'with outer intersection' do
        before do
          create(:vacation_request,
                 user: user,
                 start_date: '2015-08-30', planned_end_date: '2015-09-25')

          vacation_request.validate
        end

        it 'sets error' do
          expect(vacation_request.errors).not_to be_empty
          expect(vacation_request).not_to be_valid
        end
      end

      context 'with any kind of intersections' do
        describe 'with status="cancelled"' do
          before do
            create(:vacation_request,
                   user: user,
                   start_date: '2015-08-30', planned_end_date: '2015-09-25',
                   status: VacationRequest.statuses[:cancelled])
            vacation_request.validate
          end

          it 'does not set any errors' do
            expect(vacation_request.errors).to be_empty
            expect(vacation_request).to be_valid
          end
        end

        describe 'with status="declined"' do
          before do
            create(:vacation_request,
                   user: user,
                   start_date: '2015-08-30', planned_end_date: '2015-09-25',
                   status: VacationRequest.statuses[:declined])
            vacation_request.validate
          end

          it 'does not set any errors' do
            expect(vacation_request.errors).to be_empty
            expect(vacation_request).to be_valid
          end
        end
      end
    end

    context 'when another user has vacation requests' do
      describe 'without intersections' do
        before do
          create(:vacation_request,
                 user: another_user,
                 start_date: '2015-08-22', planned_end_date: '2015-08-30')
          create(:vacation_request,
                 user: another_user,
                 start_date: '2015-09-22', planned_end_date: '2015-09-25')
        end

        it 'does not set any errors' do
          expect(vacation_request.errors).to be_empty
          expect(vacation_request).to be_valid
        end
      end

      describe 'with intersections on start bound' do
        before do
          create(:vacation_request,
                 user: another_user,
                 start_date: '2015-08-22', planned_end_date: '2015-09-01')
        end

        it 'does not set any errors' do
          expect(vacation_request.errors).to be_empty
          expect(vacation_request).to be_valid
        end
      end

      describe 'with intersections on end bound' do
        before do
          create(:vacation_request,
                 user: another_user,
                 start_date: '2015-09-21', planned_end_date: '2015-09-25')
        end

        it 'does not set any errors' do
          expect(vacation_request.errors).to be_empty
          expect(vacation_request).to be_valid
        end
      end

      describe 'with intersections on both bounds' do
        before do
          create(:vacation_request,
                 user: another_user,
                 start_date: '2015-08-22', planned_end_date: '2015-09-01')
          create(:vacation_request,
                 user: another_user,
                 start_date: '2015-09-21', planned_end_date: '2015-09-25')
        end

        it 'does not set any errors' do
          expect(vacation_request.errors).to be_empty
          expect(vacation_request).to be_valid
        end
      end

      describe 'with inner intersection' do
        before do
          create(:vacation_request,
                 user: another_user,
                 start_date: '2015-09-05', planned_end_date: '2015-09-15')
        end

        it 'does not set any errors' do
          expect(vacation_request.errors).to be_empty
          expect(vacation_request).to be_valid
        end
      end

      describe 'with outer intersection' do
        before do
          create(:vacation_request,
                 user: another_user,
                 start_date: '2015-08-30', planned_end_date: '2015-09-25')

          vacation_request.validate
        end

        it 'sets error' do
          expect(vacation_request.errors).to be_empty
          expect(vacation_request).to be_valid
        end
      end
    end
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

    it { should validate_presence_of(:actual_end_date) }
    it { should validate_presence_of(:kind) }
    it { should validate_presence_of(:planned_end_date) }
    it { should validate_presence_of(:status) }
    it { should validate_presence_of(:start_date) }
    it { should validate_presence_of(:user) }

    it 'should ensure inclusion of actual_end_date in proper range' do
      vacation_request = build(:vacation_request)
      vacation_request.actual_end_date = '2014-12-31'
      expect(vacation_request).to be_invalid

      vacation_request.actual_end_date = '2115-12-31'
      expect(vacation_request).to be_invalid

      vacation_request.actual_end_date = '2055-12-31'
      expect(vacation_request).to be_valid
    end

    it do
      should validate_inclusion_of(:planned_end_date)
        .in_range(Date.new(2015, 01, 01)..Date.new(2115, 01, 01))
    end
  end

  context 'associations' do
    it { should have_many(:approval_requests) }
    it { should belong_to(:user) }
  end
end
