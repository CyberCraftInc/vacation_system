class VacationRequest < ActiveRecord::Base
  belongs_to  :user
  has_many    :approval_requests

  validates :duration, :kind, :start, :status, :user,
            presence: true
  validates :duration,
            numericality: { only_integer: true,
                            greater_than: 0 }
  validates :end,
            presence: true,
            inclusion: { in: Date.new(2015, 01, 01)..Date.new(2115, 01, 01) },
            if: "status == 'used'"

  scope :requested_accepted_inprogress, lambda {
    where(status: [VacationRequest.statuses[:requested],
                   VacationRequest.statuses[:accepted],
                   VacationRequest.statuses[:inprogress]])
  }

  scope :team_vacations, lambda { |team|
    joins(user: :team_roles)
      .where(team_roles: { team_id: team.id })
      .select(:id, :user_id, :start, :duration, :kind, :status)
  }

  enum status: [
    :requested,
    :accepted,
    :declined,
    :cancelled,
    :inprogress,
    :used
  ]

  enum kind: [
    :planned,
    :unpaid,
    :sickness
  ]
end
