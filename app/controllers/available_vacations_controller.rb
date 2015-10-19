require 'available_vacations/calculus'

include AvailableVacations

class AvailableVacationsController < ApplicationController
  before_action :authenticate_user!

  def index
    @records = current_user.available_vacations
    @records.each(&:accumulate_more_days)
    render json: @records
  end
end
