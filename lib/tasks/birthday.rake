require File.join(Rails.root, 'lib', 'services', 'birthday_congratulation_mail')

namespace :birthday do
  desc 'run birthday email notification check'
  task notify: :environment do
    Notification.check_reminder
  end

  desc 'run birthday email congratulation check'
  task congratulate: :environment do
    BirthdayCongratulationMail.check_birthdays
  end
end
