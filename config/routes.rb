Rails.application.routes.draw do
  root to: 'home#index'

  devise_for :users

  resources :teams,
            only: [:index, :create, :update, :destroy],
            defaults: { format: :json }

  resources :available_vacations,
            only: [:index],
            defaults: { format: :json }

  resources :vacation_requests,
            only: [:index, :create],
            defaults: { format: :json }
end
