FactoryGirl.define do
  factory :team do
    transient do
      number_of_managers  1
      number_of_members   3
      number_of_guests    1
    end

    name  { "#{FFaker::Skill.tech_skill} team" }

    trait :with_users do
      after :create do |team, evaluator|
        evaluator.number_of_managers.times do
          user = FactoryGirl.create(:user)
          FactoryGirl.create(:team_role, user: user, team: team, role: 'manager')
        end
        evaluator.number_of_members.times do
          user = FactoryGirl.create(:user)
          FactoryGirl.create(:team_role, user: user, team: team, role: 'member')
        end
        evaluator.number_of_guests.times do
          user = FactoryGirl.create(:user)
          FactoryGirl.create(:team_role, user: user, team: team, role: 'guest')
        end
      end
    end

    trait :compact do
      after :create do |team|
        user = FactoryGirl.create(:user)
        FactoryGirl.create(:team_role, user: user, team: team, role: 'manager')

        user = FactoryGirl.create(:user)
        FactoryGirl.create(:team_role, user: user, team: team, role: 'member')

        user = FactoryGirl.create(:user)
        FactoryGirl.create(:team_role, user: user, team: team, role: 'guest')
      end
    end

    trait :with_manager_only do
      after :create do |team|
        user = FactoryGirl.create(:user)
        FactoryGirl.create(:team_role, user: user, team: team, role: 'manager')
      end
    end
  end
end
