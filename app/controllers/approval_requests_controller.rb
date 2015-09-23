# Normally, each vacation request has approval request assigned to a manager.
# When approval request is accepted, it is deleted from DB.
# When vacation request has no approval requests, it changes its status
# from 'requested' to 'accepted'.
# Approval request can be declined. In this case all the approval requests
# are deleted from DB, and status of the associated vacation request
# is set to 'declined'.
# Only managers are authorized to operate on approval requests.
require 'errors/conflict_error'

class ApprovalRequestsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_approval_request, only: [:accept, :decline]
  before_action :check_vacation_request_status, only: [:accept, :decline]

  rescue_from ActiveRecord::RecordNotFound do
    head status: :not_found
  end

  rescue_from Errors::ConflictError do
    head status: :conflict
  end

  def index
    vacation_requests_ids = current_user.approval_requests
                            .pluck(:vacation_request_id).uniq
    requests = VacationRequest.find vacation_requests_ids
    render json: requests
  end

  def accept
    authorize @approval_request
    status = VacationRequest.statuses[:accepted]
    change_vacation_request_status(status) if approval_request_count == 1
    @approval_request.destroy
    head status: :ok
  end

  def decline
    # authorize @approval_request
    status = VacationRequest.statuses[:declined]
    change_vacation_request_status(status)
    @approval_request.vacation_request.approval_requests.destroy_all
    head status: :ok
  end

private

  def approval_request_count
    @approval_request.vacation_request.approval_requests.count
  end

  def change_vacation_request_status(status)
    vacation_request = @approval_request.vacation_request
    vacation_request.status = status
    vacation_request.save
    vacation_request.errors
  end

  def check_vacation_request_status
    status = @approval_request.vacation_request.status
    fail Errors::ConflictError if status != 'requested'
  end

  def set_approval_request
    @approval_request = ApprovalRequest.find_by!(id: params[:id])
  end
end
