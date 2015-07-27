FactoryGirl.define do
  factory :user do
    email   { "#{first_name.downcase}.#{last_name.downcase}@i.ua" }
    first_name  { FFaker::Name.first_name }
    last_name   { FFaker::Name.last_name }
    password    'myPrecious'

    trait :with_vacations_of_all_statuses do
      after :create do |user|
        VacationRequest.statuses.each_value do |status|
          FactoryGirl.create  :vacation_request,
                              status: status,
                              end: Time.zone.today,
                              user: user
        end
      end
    end
  end
end
