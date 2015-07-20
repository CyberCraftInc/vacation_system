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

  def vacation_request_params
    prepare_date_params
    params.require(:vacation_request)
      .permit(:kind, :start, :end, :duration, :status)
  end

  def vacation_params(val)
    params[:vacation_request][val]
  end

  def prepare_date_params
    date_from_ms(:start)
    date_from_ms(:end)
  end

  # Convert JS Date/Time in miliseconds to Ruby Date format
  def date_from_ms(val)
    return unless vacation_params(val)

    params[:vacation_request][val] = Time.zone.at(vacation_params(val) / 1000)
  end
end
