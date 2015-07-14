class AvailableVacationsController < ApplicationController
  before_action :authenticate_user!

  def index
    render json: current_user.available_vacations
  end
end
