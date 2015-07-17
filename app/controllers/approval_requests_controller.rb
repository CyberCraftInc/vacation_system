class ApprovalRequestsController < ApplicationController
  def index
    approval_requests_ids = current_user.approval_requests
                            .pluck(:vacation_request_id).compact
    requests = VacationRequest.find approval_requests_ids
    render json: requests
  end
end
