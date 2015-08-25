class VacationRequestsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_vacation_request, only: [:show, :update]

  def index
    render json: current_user.vacation_requests
  end

  def create
    @vacation_request = current_user
                        .vacation_requests.new vacation_request_params

    authorize @vacation_request
    managers_ids = current_user.list_of_assigned_managers_ids

    set_allowed_values!
    change_status!(managers_ids)

    if @vacation_request.save && create_approval_request(managers_ids)
      head status: :created
    else
      render  json: { errors: @vacation_request.errors },
              status: :unprocessable_entity
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

  def create_approval_request(managers_ids)
    return true if @vacation_request.status == 'accepted'

    records = managers_ids.map do |id|
      { manager_id: id, vacation_request_id: @vacation_request.id }
    end
    ApprovalRequest.create records
  end

  def change_status!(managers_ids)
    @vacation_request.status = 'accepted' if managers_ids.empty?
  end

  def set_allowed_values!
    @vacation_request.end = ''
    @vacation_request.status = 'requested'
  end

  def set_vacation_request
    @vacation_request = VacationRequest.find params[:id]
  end

  def vacation_request_params
    params.require(:vacation_request)
      .permit(:kind, :start, :end, :duration, :status)
  end
end
