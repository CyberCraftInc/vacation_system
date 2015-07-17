class VacationRequest < ActiveRecord::Base
  belongs_to  :user
  has_many    :approval_requests

  scope :requested_accepted_inprogress, (lambda do
    where([
      'status = ? or status= ? or status = ?',
      VacationRequest.statuses[:requested],
      VacationRequest.statuses[:accepted],
      VacationRequest.statuses[:inprogress]])
  end)


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
