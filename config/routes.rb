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
            only: [:index, :show, :create, :update],
            defaults: { format: :json }
end
