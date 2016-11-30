Rails.application.routes.draw do
  root to: 'home#index'

  devise_for :users, controllers: { invitations: 'users/invitations' }

  resources :users,
            only: [:index, :create, :update, :destroy],
            defaults: { format: :json } do
    member do
      get 'approval_requests'
      get 'available_vacations'
      get 'invite'
      get 'requested_vacations'
      get 'vacation_approvals'
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

  resources :summary,
            only: [:index],
            defaults: { format: :text }

  resources :team_roles,
            only: [:index, :create, :destroy],
            defaults: { format: :json }

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
      get 'approvers'
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
