FactoryGirl.define do
  factory :vacation_request do
    kind    'planned'
    status  'requested'
    start   '2015-02-28'
    duration  5
    user

    trait :unpaid do
      kind 'unpaid'
    end

    trait :sickness do
      kind 'sickness'
    end

    trait :invalid do
      start  '2015-02'
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
  end
end
