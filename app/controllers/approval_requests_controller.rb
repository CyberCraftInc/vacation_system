class ApprovalRequestsController < ApplicationController
  def index
    vacation_requests_ids = current_user.approval_requests
                            .pluck(:vacation_request_id).compact
    requests = VacationRequest.find vacation_requests_ids
    render json: requests
  end
end
