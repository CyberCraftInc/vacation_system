class TeamsController < ApplicationController
  respond_to :json
  before_action :set_team, only: [:update, :destroy]

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
    if team.update(team_params)
      render nothing: true, status: :no_content
    else
      render nothing: true, status: :not_found
    end
  end

  def destroy
    if team
      team.destroy
      render nothing: true, status: :no_content
    else
      render nothing: true, status: :not_found
    end
  end

private

  # Only allow a trusted parameter "white list" through.
  def team_params
    params.require(:team).permit(:name)
  end

  def set_team
    @team = Team.find params[:id]
  end
end
