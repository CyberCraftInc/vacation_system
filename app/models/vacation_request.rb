class VacationRequest < ActiveRecord::Base
  belongs_to  :user
  has_many    :approval_requests

  validate :cannot_intersect_with_other_vacations
  validates :actual_end_date, :kind, :planned_end_date,
            :status, :start_date, :user,
            presence: true
  validates :actual_end_date, :planned_end_date,
            inclusion: { in: Date.new(2015, 01, 01)..Date.new(2115, 01, 01) }

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

  def cannot_intersect_with_other_vacations
    number_of_records  = number_of_intersected_records
    number_of_records += number_of_records_that_include_vacation

    errors.add(:base, 'cannot inresect with other vacations')\
      if number_of_records > 0
  end

private

  # Number of records that somehow intersect with the vacation
  # For example, the vacation '2015-09-01'..'2015-09-10'
  # intersects with the following vacations:
  #   - '2015-09-05'..'2015-09-15', by '2015-09-05'
  #   - '2015-08-25'..'2015-09-10', by '2015-09-10'
  #   - '2015-09-05'..'2015-09-09', by both
  # The last vacation is actually included by the vacation in subject.
  def number_of_intersected_records
    VacationRequest.where(
      VacationRequest.where(start_date: start_date..actual_end_date)
        .where(actual_end_date: start_date..actual_end_date)
        .where_values
        .reduce(:or)
    ).where(user_id: user_id).count
  end

  # Number of records that includes the vacation
  # For example, the vacation '2015-09-01'..'2015-09-20'
  # includes the subject vacation '2015-09-05'..'2015-09-15'
  def number_of_records_that_include_vacation
    VacationRequest.where('start_date <= ?', start_date)
      .where('actual_end_date >= ?', actual_end_date)
      .where(user_id: user_id).count
  end
end
