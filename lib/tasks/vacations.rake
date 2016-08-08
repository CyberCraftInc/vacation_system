namespace :vacations do
  desc 'Calculate all the reported vacations for each user till 2015-12-31'
  task annual_statistic: :environment do
    till_date = Date.new(2016, 7, 31)
    puts "Annual statistics till #{till_date}"

    line  = format('%-20s', 'User,')
    line += format('%10s', 'Available')
    line += format('%10s', 'Used')
    line += format('%10s', 'Remaining')
    puts line

    holidays = Holiday.all

    User.all.each do |user|
      vacations = user
        .vacation_requests
        .where('start_date < ?', till_date)
        .where.not(status: [VacationRequest.statuses[:cancelled],
                            VacationRequest.statuses[:declined]])
        .where(kind: VacationRequest.kinds[:planned])

      reported_days = vacations.inject(0) { |a, e| a + e.duration(holidays) }
      accumulated_days = user.accumulated_days('planned')
      remaining = accumulated_days - reported_days
      line  = format('%-20s', user.full_name + ',')
      # line += format('%25.0f,', accumulated_days)
      # line += format('%20.0f,', reported_days)
      # line += format('%20.0f', remaining)
      line += format('%10.2f', accumulated_days)
      line += format('%10.2f', reported_days)
      line += format('%10.2f', remaining)
      puts line
    end
  end
end
# user: ba195da7f154b7
# pass: d569ca80
# host: us-cdbr-iron-east-03.cleardb.net
# link: heroku_d3a128f62a38de3
