class NotificationsController < ApplicationController
  respond_to :html, :json

  before_action :set_notification, only: [:edit, :update, :destroy]

  def index
    @notifications = Notification.all
    respond_with(@notifications)
  end

  def new
    @notification = Notification.new
  end

  def create
    @notification = Notification.new(notification_params)
    @notification.teams << Team.where('id' => team_params)
    @notification.save
    respond_with @notification
  end

  def edit
  end

  def update
    @notification.teams.clear
    @notification.teams << Team.where('id' => team_params)
    if @notification.update(notification_params)
      render json: @notification
    end
  end

  def destroy
    @notification.destroy
    render json: {}, status: :no_content
  end

  private

  def set_notification
    @notification = Notification.find(params[:id])
  end

  def notification_params
    params.permit(:notification_type, :timer_days, :notification_teams)
  end

  def team_params
    params.permit(:teams)
    params[:teams]
  end
end
