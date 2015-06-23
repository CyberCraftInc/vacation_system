Rails.application.routes.draw do
  root to: 'home#index'

  devise_for :users, controllers: {
    sessions: 'users/sessions'
  }

  resources :teams,
            only: [:index, :create, :edit, :update, :destroy],
            defaults: { format: :json }

  resources :available_vacations,
            only: [:index, :create, :edit, :update, :destroy],
            defaults: { format: :json }

  resources :vacation_requests,
            only: [:index, :create, :edit, :update, :destroy],
            defaults: { format: :json }
end
