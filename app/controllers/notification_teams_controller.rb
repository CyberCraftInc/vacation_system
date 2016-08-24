class NotificationTeamsController < ApplicationController
  def index
    render json: NotificationTeam.select(:id, :notification_id, :team_id)
  end
end
