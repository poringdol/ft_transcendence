Rails.application.routes.draw do
  resources :war_matches
  resources :matches
  resources :wars
  resources :addons
  resources :friends
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
  post 'guilds/update_name' => "guilds#update_name"
  post 'guilds/update_anagram' => "guilds#update_anagram"
  post 'guilds/update_logo' => "guilds#update_logo"
  get 'guilds/get_guild/:id' => 'guilds#get_guild'


# ------------------
#    PROFILE PAGE
# ------------------

  get '/user' => "profile#index"
  get '/user/:id' => "users#show" # для теста, отдает json с юзером по, user/1 например
  get 'profile/get_curr_user' => "profile#get_curr_user"
  get 'profile/:id' => "profile#index"
#   get 'profile/get_user_friends/:id' => "profile#get_user_friends"
#   get 'profile/get_user_friends2' => "profile#get_user_friends2"
  post 'profile/get_guild' => "profile#get_guild"
  get 'profile/get_user/:id' => "profile#get_user"

  get 'profile/add_friends' => 'profile#add_friends'
  get 'profile/get_friends' => 'profile#get_friends'

  # я хз почему с страницы профиля и захода напрямую вызываются разные пост запросы для users#update_
  post 'users/update_avatar' => "users#update_avatar"
  post 'users/edit/update_avatar' => "users#update_avatar"
  post 'users/update_nickname' => "users#update_nickname"
  post 'users/edit/update_nickname' => "users#update_nickname"

  get 'friends/get_friends/:id' => 'friends#get_friends'
  get 'friends/get_followers/:id' => 'friends#get_followers'
  get 'friends/is_friend/:id' => 'friends#is_friend'

  get 'friends/follow_back/:id' => 'friends#follow_back'
  get 'friends/send_request/:id' => 'friends#send_request'
  get 'friends/delete_from_friends/:id' => 'friends#delete_from_friends'
  get 'friends/unfollow_user/:id' => 'friends#unfollow_user'
  
  
  get 'welcome/index'
  root 'welcome#index'

  # 2 factor
  post 'users/enable_otp'
  post 'users/disable_otp'
  # auth
  devise_for :users, controllers: { omniauth_callbacks: "users/omniauth_callbacks" }
  devise_scope :user do
    delete 'sign_out', :to => 'devise/sessions#destroy', :as => :destroy_user_session_path
  end
end
