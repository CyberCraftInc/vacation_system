module Receivers
  def find_receivers(notification)
    Team.find_by_name(notification.teams.map(&:name)).users.map(&:email)
  end
end
