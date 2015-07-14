class AvailableVacation < ActiveRecord::Base
  belongs_to :user

  enum kind: [
    :planned,
    :unpaid,
    :sickness
  ]
end
