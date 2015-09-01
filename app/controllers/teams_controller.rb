class TeamsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_team, only: [:update, :destroy, :members, :vacations]

  rescue_from ActiveRecord::RecordNotFound do
    head status: :not_found
  end

  def index
    render json: Team.all
  end

  def create
    team = Team.new team_params
    authorize team
    if team.save
      render json: team
    else
      render json: { errors: team.errors }, status: :unprocessable_entity
    end
  end

  def update
    authorize @team
    if @team.update(team_params)
      head status: :no_content
    else
      render json: { errors: @team.errors }, status: :unprocessable_entity
    end
  end

  def destroy
    authorize @team
    @team.destroy
    head status: :no_content
  end

  def members
    render json: @team.users
  end

  def vacations
    vacations = VacationRequest
                .team_vacations(@team)
                .requested_accepted_inprogress
    render json: vacations
  end

private

  def team_params
    params.require(:team).permit(:name)
  end

  def set_team
    @team = Team.find_by!(id: params[:id])
  end
end
