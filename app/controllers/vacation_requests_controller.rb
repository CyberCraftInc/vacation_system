class VacationRequestsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_vacation_request, only: [:show, :update]

  def index
    render json: current_user.vacation_requests
  end

  def create
    @vacation_request = VacationRequest.new vacation_request_params
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

  def set_vacation_request
    @vacation_request = VacationRequest.find params[:id]
  end

  # Convert JS Date/Time in miliseconds to Ruby Date format
  def date_from_ms(ms)
    Time.zone.at(ms / 1000) unless ms.nil?
  end

  def prepare_date
    date_in_ms = params[:vacation_request][:start]
    params[:vacation_request][:start] = date_from_ms(date_in_ms) if date_in_ms

    date_in_ms = params[:vacation_request][:end]
    params[:vacation_request][:end]   = date_from_ms(date_in_ms) if date_in_ms
  end

  def vacation_request_params
    prepare_date
    params.require(:vacation_request)
      .permit(:kind, :start, :end, :duration, :status)
  end
end
