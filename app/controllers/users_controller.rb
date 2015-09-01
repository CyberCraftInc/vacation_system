class UsersController < ApplicationController
  before_action :authenticate_user!

  def index
    render json: User.all
  end

  def requested_vacations
    requests = VacationRequest.where(user_id: params[:id]).requested
    render json: requests
  end
end
