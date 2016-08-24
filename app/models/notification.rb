require File.join(Rails.root, 'lib', 'services', 'birthday_notification_mail')
require File.join(Rails.root, 'lib', 'services', 'appraisal_notification')

class Notification < ActiveRecord::Base
  CATEGORIES = ['Birthday email notification', 'Appraisal Notification'].freeze
  has_many  :notification_teams, dependent: :destroy
  has_many  :teams, through: :notification_teams

  def as_json(options = {})
    options[:only] = [
        :id,
        :notification_type,
        :timer_days
    ]

    super options
  end

  def self.check_reminder
    type = notification.notification_type
    Notification.all.each do |notification|
      if type == 'Birthday email notification'
        BirthdayNotificationMail.new(notification).tap(&:check_reminder)
      elsif type == 'Appraisal Notification'
        AppraisalNotification.new(notification).tap(&:check_reminder)
      end
    end
  end
end
