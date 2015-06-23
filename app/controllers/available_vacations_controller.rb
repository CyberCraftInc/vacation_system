class AvailableVacationsController < ApplicationController
  before_action :authenticate_user!

  # GET
  # /resource
  # All available vacations for the user
  def index
    render json: current_user.available_vacations
  end

  # POST
  # /resource
  def create
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
  # def available_vacations_params
  #   params.require(:available_vacations).permit(:name)
  # end
end
