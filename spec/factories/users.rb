FactoryGirl.define do
  factory :user do
    email   { "#{first_name.downcase}.#{last_name.downcase}@i.ua" }
    first_name  { FFaker::Name.first_name }
    last_name   { FFaker::Name.last_name }
    password    'myPrecious'

    trait :with_vacations_of_all_statuses do
      start_date = Time.zone.today
      after :create do |user|
        VacationRequest.statuses.each_value do |status|
          start_date += 3.days
          FactoryGirl.create  :vacation_request,
                              status: status,
                              start_date: start_date,
                              planned_end_date: start_date + 2.days,
                              user: user
        end
      end
    end
  end
end
