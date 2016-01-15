namespace :vacations do
  desc 'Calculate all the reported vacations for each user till 2015-12-31'
  task annual_statistic: :environment do
    line  = format('%-30s', 'User,')
    line += format('%25s,', 'Available')
    line += format('%20s,', 'Used')
    line += format('%20s', 'Remaining')
    puts line

    holidays = Holiday.all

    # .where('start_date < ?', Date.new(2016, 1, 1))
    User.all.each do |user|
      vacations = user
        .vacation_requests
        .where('start_date < ?', Date.new(2016, 3, 8))
        .where.not(status: [VacationRequest.statuses[:cancelled],
                            VacationRequest.statuses[:declined]])
        .where(kind: VacationRequest.kinds[:planned])

      reported_days = vacations.inject(0) { |a, e| a + e.duration(holidays) }
      accumulated_days = user.accumulated_days('planned')
      remaining = accumulated_days - reported_days
      line  = format('%-30s', user.full_name + ',')
      # line += format('%25.0f,', accumulated_days)
      # line += format('%20.0f,', reported_days)
      # line += format('%20.0f', remaining)
      line += format('%25.2f,', accumulated_days)
      line += format('%20.2f,', reported_days)
      line += format('%20.2f', remaining)
      puts line
    end
  end
end
# user: ba195da7f154b7
# pass: d569ca80
# host: us-cdbr-iron-east-03.cleardb.net
# link: heroku_d3a128f62a38de3
