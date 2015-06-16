class TeamRole < ActiveRecord::Base
  belongs_to  :user
  belongs_to  :team

  enum role: [
    :guest,
    :member,
    :manager
  ]
end
