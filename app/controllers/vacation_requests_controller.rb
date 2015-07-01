class VacationRequestsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_vacation_request, only: [:show, :update]

  def index
    render json: current_user.vacation_requests
  end

  def create
    @vacation_request = VacationRequest.new vacation_request_params
    # Convert JS Date/Time in miliseconds to Ruby Date format
    @vacation_request.start = Time.zone.at(@vacation_request.start / 1000)
    @vacation_request.user_id = current_user.id

    if @vacation_request.save
      head status: :created
    else
      head status: 500
    end
  end

  def show
    render json: @vacation_request
  end

  def update
    if @vacation_request.update(vacation_request_params)
      head  status: :no_content
    else
      head  status: :not_found
    end
  end

private

  def vacation_request_params
    params.require(:vacation_request)
      .permit(:kind, :start, :end, :duration, :status)
  end

  def set_vacation_request
    @vacation_request = VacationRequest.find params[:id]
  end
end
