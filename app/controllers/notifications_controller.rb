class NotificationsController < ApplicationController
  before_action :set_notification, only: [:edit, :update, :destroy]

  def index
    @notifications = Notification.all
  end

  def new
    @notification = Notification.new
  end

  def create
    @notification = Notification.new(notification_params)
    @notification.teams << Team.where('id' => team_params[:id])
    redirect_to notifications_path if @notification.save
  end

  def edit
  end

  def update
    if @notification.update_attributes(notification_params)
      redirect_to notifications_path
    end
  end

  def destroy
    @notification.destroy
    redirect_to notifications_path
  end

  private

  def set_notification
    @notification = Notification.find(params[:id])
  end

  def notification_params
    params.require(:notification).permit(:notification_type, :timer_days)
  end

  def team_params
    params.require(:notification).permit(id: [])
  end
end
