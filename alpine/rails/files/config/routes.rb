Rails.application.routes.draw do
  resources :messages
  resources :rooms
  resources :guilds


  get 'guilds/index'
  post 'guilds/join'
  post 'create_new_guild' => 'guilds#create_new_guild', as: 'create_new_guild'
#   delete 'get_guilds/:id' => 'guilds#destroy'
  post 'guilds/exit'
  post 'guilds/add_officer'
  post 'guilds/delete_officer'
  post 'guilds/delete_member'
  get 'welcome/index'

  root 'welcome#index'
  get '/user' => "profile#index", :as => :user_root
  get 'get_guilds' => "guilds#get_guilds", as: 'get_guilds'
  get 'get_curr_user' => "guilds#get_curr_user", as: 'get_curr_user'
  resources :guilds



  devise_for :users, controllers: { omniauth_callbacks: "users/omniauth_callbacks" }
  devise_scope :user do
    delete 'sign_out', :to => 'devise/sessions#destroy', :as => :destroy_user_session_path
  end
end
