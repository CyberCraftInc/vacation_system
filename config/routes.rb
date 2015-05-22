Rails.application.routes.draw do
  root to: 'teams#index'

  devise_for :users, controllers: {
    sessions: 'users/sessions'
  }

  resources :teams
end
