Rails.application.routes.draw do
  root to: 'home#index'

  devise_for :users

  resources :users,
            only: [:index],
            defaults: { format: :json } do
    member do
      get 'approval_requests'
      get 'requested_vacations'
    end
  end

  resources :teams,
            only: [:index, :create, :update, :destroy],
            defaults: { format: :json } do
    member do
      get 'members'
      get 'vacations'
    end
  end

  resources :holidays,
            only: [:index, :create, :update, :destroy],
            defaults: { format: :json }

  resources :available_vacations,
            only: [:index],
            defaults: { format: :json }

  resources :vacation_requests,
            only: [:index, :show, :create, :update],
            defaults: { format: :json } do
    member do
      get 'cancel'
      get 'finish'
      get 'start'
    end
  end

  resources :approval_requests,
            only: [:index],
            defaults: { format: :json } do
    member do
      get 'accept'
      get 'decline'
    end
  end
end
