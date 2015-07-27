class AvailableVacation < ActiveRecord::Base
  belongs_to :user

  validates :available_days, :kind, :user_id,
            presence: true
  validates :user_id,
            uniqueness: { scope: :kind,
                          message: 'already has this type of limit' }
  validates :available_days,
            numericality: { only_float: true,
                            greater_than: 0 }

  validates_associated :user

  enum kind: [
    :planned,
    :unpaid,
    :sickness
  ]
end
