class VacationRequestsController < ApplicationController
  before_action :authenticate_user!

  def index
    render json: current_user.vacation_requests
  end

  def create
    @vacation_request = VacationRequest.new vacation_requests_params
    # Convert JS Date/Time in miliseconds to Ruby Date format
    @vacation_request.start = Time.at(@vacation_request.start / 1000)
    @vacation_request.user_id = current_user.id

    if @vacation_request.save
      head status: :created
    else
      head status: 500
    end
  end

  def show
    @vacation_request = VacationRequest.find params[:id]
    render json: @vacation_request
  end

private

  def vacation_requests_params
    params.require(:vacation_request).permit(:kind, :start, :duration)
  end
end
