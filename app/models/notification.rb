require File.join(Rails.root, 'lib', 'services', 'birthday_notification_mail')
require File.join(Rails.root, 'lib', 'services', 'appraisal_notification')

class Notification < ActiveRecord::Base
  CATEGORIES = ['Birthday email notification', 'Appraisal Notification'].freeze
  has_and_belongs_to_many :teams,
                          association_foreign_key: 'team_id',
                          class_name: 'Team',
                          join_table: 'notifications_teams'
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
