FactoryGirl.define do
  factory :available_vacation do
    user
    available_days  5
    kind            'unpaid'
  end
end
