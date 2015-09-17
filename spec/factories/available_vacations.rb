FactoryGirl.define do
  factory :available_vacation do
    available_days  5
    kind            'unpaid'
    user
  end
end
