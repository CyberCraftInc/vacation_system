class TeamRole < ActiveRecord::Base
  belongs_to  :user
  belongs_to  :team

  validates :role,    presence: true
  validates :team_id, presence: true
  validates :user_id,
            presence: true,
            uniqueness: { scope: :team,
                          message: 'already has a role in the team' }

  validates_associated :user
  validates_associated :team

  enum role: [
    :guest,
    :member,
    :manager
  ]
end
