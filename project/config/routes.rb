Rails.application.routes.draw do
  mount Rswag::Ui::Engine => '/api-docs'
  mount Rswag::Api::Engine => '/api-docs'
  
  get "up" => "rails/health#show", as: :rails_health_check
  
  root "home#index"
  get "/partials/:name", to: "partials#show"

  resources :clients
  resources :masters
  resources :services
  resources :bookings
  resource :undo, only: [:show, :create]

  resources :backups, only: [:create, :index] do
      post 'restore', on: :collection
      post ':filename/restore', to: 'backups#restore_specific', on: :collection
  end

  namespace :reports do
    get :revenue
    get :masters
    get :clients
  end
  
  match '*path',
      to: proc { [204, {}, ['']] },
      via: :options
end
