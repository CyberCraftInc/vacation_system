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

    errors.add(:base, 'cannot intersect with other vacations')\
      if number_of_records > 0
  end

private

  # Number of records that somehow intersect with the vacation.
  # For example, the vacation '2015-09-01'..'2015-09-10'
  # intersects with the following vacations:
  #   - '2015-09-01'..'2015-09-20', the vacation contains subject vacation
  #   - '2015-09-05'..'2015-09-15', by '2015-09-05'
  #   - '2015-08-25'..'2015-09-10', by '2015-09-10'
  #   - '2015-09-05'..'2015-09-09', subject vacation contains the vacation
  # NOTE: As of RoR 4 there is no way to compose SQL conditions
  #       with 'OR' operator, by using ActiveRecord.
  #       DHH promises to release this feature in RoR 5.
  #       But it is possible to solve the problem with Arel.
  #       https://github.com/rails/arel
  def number_of_intersected_records
    table = VacationRequest.arel_table

    VacationRequest.where(
      table[:start_date].between(start_date..actual_end_date)
      .or(table[:actual_end_date].between(start_date..actual_end_date))
      .or(table[:start_date].lteq(start_date)
        .and(table[:actual_end_date].gteq(actual_end_date)))
    ).where(user_id: user_id).count
  end
end
