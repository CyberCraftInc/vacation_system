FactoryGirl.define do
  factory :vacation_request do
    kind    'planned'
    start_date        { Time.zone.now }
    planned_end_date  { (Date.parse(start_date.to_s) + 2.days).to_s }
    actual_end_date   { planned_end_date }
    status  'requested'
    user

    trait :unpaid do
      kind 'unpaid'
    end

    trait :sickness do
      kind 'sickness'
    end

    trait :invalid do
      start_date        '2015-02'
      planned_end_date  '20015-02-28'
      actual_end_date   '2015'
    end

    trait :accepted do
      status 'accepted'
    end

    trait :declined do
      status 'declined'
    end

    trait :cancelled do
      status 'cancelled'
    end

    trait :inprogress do
      status 'inprogress'
    end

    trait :used do
      status 'used'
    end

    trait :with_approval_requests do
      after :create do |vacation_request|
        user = User.find_by id: vacation_request.user_id
        user.list_of_assigned_managers_ids.each do |manager_id|
          ApprovalRequest.create(vacation_request_id: vacation_request.id,
                                 manager_id: manager_id)
        end
      end
    end
  end
end
