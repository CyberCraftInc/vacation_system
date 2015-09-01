class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  include Pundit

  rescue_from Pundit::NotAuthorizedError do
    head status: :forbidden
  end

  protect_from_forgery with: :exception
end
