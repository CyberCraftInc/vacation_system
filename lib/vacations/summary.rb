module Vacations
  def summary(till_date)
    result  = "Vacations summary till #{till_date} (including last day)\n"
    result += format('%-20s', 'User,')
    result += format('%13s', 'Available,')
    result += format('%11s', 'Used,')
    result += format('%10s', 'Remaining')
    result += "\n"

    holidays = Holiday.all.dates

    User.all.each do |user|
      vacations = user
        .vacation_requests
        .where('start_date <= ?', till_date)
        .where('end_date >= ?', user.employment_date)
        .where.not(status: [VacationRequest.statuses[:cancelled],
                            VacationRequest.statuses[:declined]])
        .where(kind: VacationRequest.kinds[:planned])

      reported_days = vacations.inject(0) { |a, e| a + e.duration(holidays) }
      accumulated_days = user.accumulated_days('planned', till_date)
      remaining = accumulated_days - reported_days
      result += format('%-20s', user.full_name + ',')
      result += format('%12.2f,', accumulated_days)
      result += format('%10.2f,', reported_days)
      result += format('%10.2f', remaining)
      result += "\n"
    end
    result
  end
end
