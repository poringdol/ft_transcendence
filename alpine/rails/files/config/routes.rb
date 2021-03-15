Rails.application.routes.draw do
  resources :messages
  resources :rooms


  get 'guilds/index'
  post 'guilds/join'
  post 'guilds/exit'
  post 'guilds/add_officer'
  post 'guilds/delete_officer'
  post 'guilds/delete_member'
  get 'welcome/index'

  root 'welcome#index'
  get '/user' => "profile#index", :as => :user_root
  resources :guilds



  devise_for :users, controllers: { omniauth_callbacks: "users/omniauth_callbacks" }
  devise_scope :user do
    delete 'sign_out', :to => 'devise/sessions#destroy', :as => :destroy_user_session_path
  end
end
