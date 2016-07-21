require File.join(Rails.root, 'lib', 'modules', 'receivers')

class AppraisalNotification
  include Receivers

  def initialize(notification)
    @notification = notification
  end

  def check_reminder
    User.all.each do |user_item|
      if user_item.appraisal_period.nil? # rescue
        next
      elsif user_item.appraisal_date.blank?
        appraisal_from_emp_date_calc(user_item)
      else
        appraisal_calc(user_item)
      end
    end
  end

  private

  def send_reminder(user_item, team_users_mails, appraisal_day)
    team_users_mails.each do |mail|
      UserNotifier
        .send_appraisal_reminder(mail, user_item, appraisal_day)
        .deliver_now
    end
  end

  def appraisal_from_emp_date_calc(user_item)
    time = Time.now
    period = user_item.appraisal_period
    empl_date = user_item.employment_date.to_datetime
    count = (time.to_datetime - empl_date).to_i / period
    @appraisal_day = empl_date + period * (count + 1)
    if (@appraisal_day - @notification.timer_days.days).strftime('%m-%d') ==
        time.strftime('%m-%d')
      send_reminder(user_item, find_receivers(@notification), @appraisal_day)
    end
  end

  def appraisal_calc(user_item)
    @appraisal_day = user_item.appraisal_date + user_item.appraisal_period
    if (@appraisal_day - @notification.timer_days.days).strftime('%m-%d') ==
        Time.now.strftime('%m-%d')
      send_reminder(user_item, find_receivers(@notification), @appraisal_day)
    end
  end
end
