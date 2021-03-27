Rails.application.routes.draw do
  resources :messages
  resources :rooms
  resources :guilds

# ------------------
#    GUILDS PAGE
# ------------------
  get 'guilds/index'
  get '/get_guild_users/:id', to: 'guilds#get_guild_users'
  get '/get_owner_nick/:id', to: 'guilds#get_owner_nick'
  post 'guilds/join'
  post 'create_new_guild' => 'guilds#create_new_guild', as: 'create_new_guild'
  post 'guilds/exit'
  post 'guilds/add_officer'
  post 'guilds/delete_officer'
  post 'guilds/delete_member'
  get 'get_guilds' => "guilds#get_guilds", as: 'get_guilds'
  get 'get_curr_user' => "guilds#get_curr_user", as: 'get_curr_user'
  resources :guilds

# ------------------
#    PROFILE PAGE
# ------------------
#   get '/user' => "profile#index", :as => :user_root
  get '/user' => "profile#index"
  get '/user/:id' => "profile#index"
  get 'ind' => "profile#index_id", as: 'ind'
  get 'profile/get_curr_user' => "profile#get_curr_user"






  get 'welcome/index'
  root 'welcome#index'
  

  post 'users/enable_otp'
  post 'users/disable_otp'
  devise_for :users, controllers: { omniauth_callbacks: "users/omniauth_callbacks" }
  devise_scope :user do
    delete 'sign_out', :to => 'devise/sessions#destroy', :as => :destroy_user_session_path
  end
end
