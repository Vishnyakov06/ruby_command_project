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

  match '*path',
      to: proc { [204, {}, ['']] },
      via: :options
end
