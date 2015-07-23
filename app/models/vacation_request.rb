class VacationRequest < ActiveRecord::Base
  belongs_to  :user
  has_many    :approval_requests

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
