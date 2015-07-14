class VacationRequest < ActiveRecord::Base
  belongs_to  :user
  has_many    :approval_requests

  enum status: [
    :reserved,
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
