class UsersController < ApplicationController
  def index
    fetch_current_user_details
    render json: {
      current_user: current_user,
      current_user_roles: @current_user_roles,
      users: User.all
    }
  end

  def requested_vacations
    requests = VacationRequest.where(user_id: params[:id]).requested
    render json: requests
  end

private

  def fetch_current_user_details
    @current_user_roles = current_user.team_roles unless current_user.nil?
  end
end
