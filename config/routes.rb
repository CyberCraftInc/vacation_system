Rails.application.routes.draw do
  root to: 'home#index'

  get '/requested_vacations/:user_id',
      to: 'vacation_requests#requested',
      defaults: { format: :json }

  get '/team_members/:id',
      to: 'teams#members',
      defaults: { format: :json }

  get '/team_vacations/:id',
      to: 'teams#vacations',
      defaults: { format: :json }

  devise_for :users

  resources :users,
            only: [:index],
            defaults: { format: :json }

  resources :teams,
            only: [:index, :create, :update, :destroy],
            defaults: { format: :json }

  resources :available_vacations,
            only: [:index],
            defaults: { format: :json }

  resources :vacation_requests,
            only: [:index, :show, :create, :update],
            defaults: { format: :json }

  resources :approval_requests,
            only: [:index],
            defaults: { format: :json }
end
