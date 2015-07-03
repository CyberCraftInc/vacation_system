class UsersController < ApplicationController
  def index
    fetch_current_user_details
    render json: {
      current_user: current_user,
      current_user_roles: @current_user_roles,
      users: User.all
    }
  end

private

  def fetch_current_user_details
    user = current_user
    @current_user_roles = user.team_roles unless user.nil?
  end
end
