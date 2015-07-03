class ApprovalRequestsController < ApplicationController
  def index
    requests = current_user.approval_requests.collect do |record|
      VacationRequest.find record.vacation_request_id
    end
    render json: requests
  end
end
