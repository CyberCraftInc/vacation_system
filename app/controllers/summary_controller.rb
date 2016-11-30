require 'vacations/summary'
include Vacations

class SummaryController < ApplicationController
  before_action :authenticate_user!

  def index
    # result = VacationRequest.not_cancelled_declined
    result = Vacations.summary(Time.zone.today)

    # render json: result
    # render text: result.inspect
    render text: result
  end

  # def start
  #   result = VacationRequest.not_cancelled_declined
  #
  #   render json: result
  # end
end
