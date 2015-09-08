class VacationRequest < ActiveRecord::Base
  belongs_to  :user
  has_many    :approval_requests

  validates :kind, :planned_end_date, :start_date, :status, :user,
            presence: true
  validates :actual_end_date,
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
      .select(:id, :user_id, :kind, :status, :actual_end_date,
              :planned_end_date, :start_date)
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
