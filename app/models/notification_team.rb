class NotificationTeam < ActiveRecord::Base
  belongs_to  :notification
  belongs_to  :team
end
