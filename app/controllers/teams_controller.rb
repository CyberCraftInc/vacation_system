class TeamsController < ApplicationController
  respond_to :json
  # GET /teams
  def index
    @teams = Team.all
    # respond_with @teams

    respond_to do |format|
      format.html
      format.json { render json: @teams }
    end
  end

  # POST      /teams
  def create
    @team = Team.new team_params
    if @team.save
      respond_with @team
    else
      respond_with @team
    end
  end

  # GET       /teams/:id
  def show
  end

  # PUT/PATCH /teams/:id
  def update
    team = Team.find params[:id]

    if team.update(team_params)
      render nothing: true, status: :no_content
    else
      render nothing: true, status: :not_found
    end
  end

  # DELETE    /teams/:id
  def destroy
    team = Team.find params[:id]
    if team
      team.destroy
      render nothing: true, status: :no_content
      # render nothing: true, status: :ok
    else
      render nothing: true, status: :no_found
    end
  end

private

  # Only allow a trusted parameter "white list" through.
  def team_params
    params.require(:team).permit(:name)
  end
end
