module NotificationsHelper
  def teams(notification)
    notification.teams.ids
  end
end
