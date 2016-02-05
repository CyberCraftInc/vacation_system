FactoryGirl.define do
  factory :available_vacation do
    available_days  5
    kind            'regular'
    user
  end
end
