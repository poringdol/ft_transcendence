Rails.application.routes.draw do
  resources :messages
  resources :rooms
  resources :guilds

  get 'welcome/index'
  root 'welcome#index'


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
  post 'guilds/update_name' => "guilds#update_name"
  post 'guilds/update_anagram' => "guilds#update_anagram"
  post 'guilds/update_logo' => "guilds#update_logo"


# ------------------
#    PROFILE PAGE
# ------------------
#   get '/user' => "profile#index", :as => :user_root
  get '/user' => "profile#index"
  get '/user/:id' => "profile#index"
  get 'ind' => "profile#index_id", as: 'ind'
  get 'profile/get_curr_user' => "profile#get_curr_user"

  # я хз почему с страницы профиля и захода напрямую вызываются разные пост запросы для users#update_avatar
  post 'users/update_avatar' => "users#update_avatar"
  post 'users/edit/update_avatar' => "users#update_avatar"
  post 'users/update_nickname' => "users#update_nickname"
  post 'users/edit/update_nickname' => "users#update_nickname"


  # 2 factor
  post 'users/enable_otp'
  post 'users/disable_otp'
  # auth
  devise_for :users, controllers: { omniauth_callbacks: "users/omniauth_callbacks" }
  devise_scope :user do
    delete 'sign_out', :to => 'devise/sessions#destroy', :as => :destroy_user_session_path
  end
end
