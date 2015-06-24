class VacationRequestsController < ApplicationController
  respond_to :json

  before_action :authenticate_user!

  # GET
  # /resource
  # All the user's vacation requests
  def index
    render json: current_user.vacation_requests
  end

  # POST
  # /resource
  def create
    @vacation_request = VacationRequest.new vacation_requests_params
    # Convert JS Date/Time in miliseconds to Ruby Date format
    @vacation_request.start = Time.at(@vacation_request.start / 1000)
    @vacation_request.user_id = current_user.id
    if @vacation_request.save
      respond_with @vacation_request
    else
      respond_with @vacation_request
    end
  end

  # PATCH
  # /resource/:id
  def update
  end

  # DELETE
  # /resource/:id
  def destroy
  end

private

  # Only allow a trusted parameter "white list" through.
  # TODO: update list of params
  def vacation_requests_params
    params.require(:vacation_request).permit(:kind, :start, :duration)
  end
end
