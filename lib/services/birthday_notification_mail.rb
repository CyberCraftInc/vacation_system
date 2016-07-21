require File.join(Rails.root, 'lib', 'modules', 'receivers')

class BirthdayNotificationMail
  include Receivers

  def initialize(notification)
    @notification = notification
  end

  def check_reminder
    birthday = User.birthdays.select do |item|
      (item - @notification.timer_days.days).strftime('%d-%m') ==
        Time.now.strftime('%d-%m')
    end
    send_reminder(birthday, find_receivers(@notification)) if birthday
  end

  private

  def send_reminder(birthday, team_users_mails)
    User.where(birth_date: birthday).each do |user|
      team_users_mails.each do |mail|
        UserNotifier
          .send_birthday_reminder(mail, user, birthday[0]).deliver_now
      end
    end
  end
end
