class TeamsController < ApplicationController
  respond_to :json
  before_action :set_team, only: [:update, :destroy, :members, :vacations]

  def index
    @teams = Team.all

    respond_to do |format|
      format.html
      format.json { render json: @teams }
    end
  end

  def create
    @team = Team.new team_params
    if @team.save
      respond_with @team
    else
      respond_with @team
    end
  end

  def update
    if @team.update(team_params)
      render nothing: true, status: :no_content
    else
      render nothing: true, status: :not_found
    end
  end

  def destroy
    if @team
      @team.destroy
      render nothing: true, status: :no_content
    else
      render nothing: true, status: :not_found
    end
  end

  def members
    if @team
      members = @team.users
      render json: members
    else
      head  status: :not_found
    end
  end

  def vacations
    if @team
      vacations = @team.users.collect do |user|
        filter_user_requests_by_status user
      end
      render json: vacations
    else
      head  status: :not_found
    end
  end

private

  def filter_user_requests_by_status(user)
    user.vacation_requests.where ['status = ? or status= ? or status = ?',
                                  VacationRequest.statuses[:requested],
                                  VacationRequest.statuses[:accepted],
                                  VacationRequest.statuses[:inprogress]]
  end

  # Only allow a trusted parameter "white list" through.
  def team_params
    params.require(:team).permit(:name)
  end

  def set_team
    @team = Team.find params[:id]
  end
end
