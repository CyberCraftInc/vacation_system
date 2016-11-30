require 'vacations/summary'
include Vacations

class SummaryController < ApplicationController
  before_action :authenticate_user!

  def index
    result = Vacations.summary(Time.zone.today)

    render text: result
  end

  # def till
  #   result = VacationRequest.not_cancelled_declined
  #
  #   render json: result
  # end
end
