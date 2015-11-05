class UsersController < ApplicationController
  before_action :authenticate_user!

  def index
    render json: User.all
  end

  def approval_requests
    authorize current_user
    requests = VacationRequest
      .joins(:approval_requests, :user)
      .where(approval_requests: { manager_id: params[:id] })
      .select('users.first_name', 'users.last_name', 'users.id as user_id',
              'approval_requests.id as id',
              :kind, :end_date, :start_date)

    render json: requests
  end

  def available_vacations
    # authorize current_user
    records = AvailableVacation.where(user_id: params[:id])
    records.each(&:accumulate_more_days)

    render json: records
  end

  def requested_vacations
    authorize current_user
    requests = VacationRequest.where(user_id: params[:id]).requested
    render json: requests
  end
end
