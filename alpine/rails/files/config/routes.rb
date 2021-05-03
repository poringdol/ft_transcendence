Rails.application.routes.draw do
  resources :tournaments
  resources :guild_invites
  resources :room_users
  resources :blocklists
  resources :matches
  resources :wars
  resources :addons
  resources :friends
  resources :messages
  resources :rooms
  resources :guilds

  # get '*unmatched_route', to: 'application#raise_not_found'

  # root 'users#edit'
  root 'welcome#index'
  get 'welcome/index'
  post '/notification/destroy' => 'notification#destroy'
# ------------------
#    GUILDS PAGE
# ------------------
  get 'guilds/index'
  get '/get_guild_users/:id', to: 'guilds#get_guild_users'
  put '/get_guild_users/:id', to: 'guilds#user_update'
  get '/get_owner_nick/:id', to: 'guilds#get_owner_nick'
  post 'guilds/join'
  post 'create_new_guild' => 'guilds#create_new_guild', as: 'create_new_guild'
  post 'guilds/exit'
  get 'guilds/exit' => 'guilds#exit'
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

  get 'guilds/is_officer/:id' => 'guilds#is_officer'
  get 'guilds/is_owner/:id' => 'guilds#is_owner'
  get 'guilds/exit_user/:id' => 'guilds#exit_user'
  get 'guilds/do_owner/:id' => 'guilds#do_owner'
  get 'guilds/do_officer/:id' => 'guilds#do_officer'
  get 'guilds/undo_officer/:id' => 'guilds#undo_officer'

  get '/guilds_list' => 'guilds#guilds_list'

# ------------------
#   GUILDS INVITES
# ------------------
  get 'guild_invites/invite_to_guild/:id' => 'guild_invites#invite_to_guild'
  get 'guild_invites/users_invites/:id' => 'guild_invites#users_invites'
  get 'guild_invites/accept_invitation/:id' => 'guild_invites#accept_invitation'
  get 'guild_invites/decline_invitation/:id' => 'guild_invites#decline_invitation'
  get 'guild_invites/del_all_invites/:id' => 'guild_invites#del_all_invites'

# ------------------
#    PROFILE PAGE
# ------------------
  get '/user' => "profile#index"
  get '/user/:id' => "users#show" # для теста, отдает json с юзером по, user/1 например
  get 'profile/get_curr_user' => "profile#get_curr_user"
  get 'profile/:id' => "profile#index"
  get 'profile/get_user/:id' => "profile#get_user"
  get 'profile/ban_user/:id' => "profile#ban_user"
  get 'profile/unban_user/:id' => "profile#unban_user"
  get 'profile/undo_moderator_user/:id' => "profile#undo_moderator_user"
  get 'profile/do_moderator_user/:id' => "profile#do_moderator_user"

  get 'block_list' => "profile#block_list"
  get 'profile/block_list_detailed/:id' => "profile#block_list_detailed"
  get 'blocklists/unblock_user/:id' => 'blocklists#unblock_user'
  get 'blocklists/unblock_user_by_id/:id' => 'blocklists#unblock_user_by_id'
  get 'blocklists/block_user/:id' => 'blocklists#block_user'
  get 'blocklists/is_blocked/:id' => 'blocklists#is_blocked'

  get 'users' => "users#edit"
  # я хз почему с страницы профиля и захода напрямую вызываются разные пост запросы для users#update_
  post 'users/update_avatar' => "users#update_avatar"
  post 'users/edit/update_avatar' => "users#update_avatar"
  post 'users/update_nickname' => "users#update_nickname"
  post 'users/edit/update_nickname' => "users#update_nickname"
  # block/unblock in chat
  post 'users/block_user' => 'users#block_user'
  post 'rooms/block_user' => 'users#block_user'
  post 'users/unblock_user' => 'users#unblock_user'
  post 'rooms/unblock_user' => 'users#unblock_user'

  get 'users/online' => 'users#online'

  get '/leaderboard' => 'users#index'
  get '/users_list' => 'users#users_list'

# ------------------------------------
#   PROFILE PAGE - FRIENDS CONTROLLER
# ------------------------------------
  get 'friends/get_friends/:id' => 'friends#get_friends'
  get 'friends/get_followers/:id' => 'friends#get_followers'
  get 'friends/is_friend/:id' => 'friends#is_friend'
  get 'friends/follow_back/:id' => 'friends#follow_back'
  get 'friends/send_request/:id' => 'friends#send_request'
  get 'friends/delete_from_friends/:id' => 'friends#delete_from_friends'
  get 'friends/unfollow_user/:id' => 'friends#unfollow_user'

# ------------------
#    CHAT PAGE
# ------------------
  post 'rooms/pass_check' => 'rooms#pass_check'
  post 'rooms/create' => 'rooms#create'
 # post 'create' => 'rooms#create' # ПОДУМОЙ
  post 'rooms/leave' => 'rooms#leave'
  post 'rooms/change_pass' => 'rooms#change_pass'
  post 'change_pass' => 'rooms#change_pass'
  post 'rooms/do_admin' => 'rooms#do_admin'
  post 'rooms/rm_admin' => 'rooms#rm_admin'
  post 'rooms/mute_user' => 'rooms#mute_user'
  post 'rooms/new_match' => 'matches#new_match'
  post 'rooms/kick' => 'rooms#kick'

  post 'rooms/watch_stream' => 'matches#watch_stream'

# ------------------
#    GAME PAGE
# ------------------
  # post 'matches/move_bracket/:id' => 'matches#move_bracket'
  get 'matches/match_users/:id' => 'matches#match_users'
  put 'matches/match_users/:id' => 'matches#match_users_update'

  get 'matches/get_player/:id' => 'matches#get_player'
  post 'matches/new_match' => 'matches#new_match'

  get 'matches/users_matches/:id' => 'matches#users_matches'
  get 'create_random_match' => 'matches#create_random_match'
  get 'random_matches' => 'matches#random_matches'
  get 'new_match_profile/:id' => 'matches#new_match_profile'

  post 'matches/end_game' => 'matches#end_game'
  get 'matches/war_matches/:id' => 'matches#war_matches'

# ------------------
# WARS
# ------------------
  get 'wars/guild_wars/:id' => 'wars#guild_wars'
  get 'wars/decline/:id' => 'wars#decline'
  get 'wars/accept/:id' => 'wars#accept'

  post 'create_war_match' => 'wars#create_war_match'
  post '/wars/join_match' => 'wars#join_match'

# ------------------
# TOURNAMENTS
# ------------------
  get '/tournaments/result/:id' => 'tournaments#result'
  post '/tournaments/join' => 'tournaments#join'
  get '/tournaments/leave/:id' => 'tournaments#leave'
  get '/tournaments/members/:id' => 'tournaments#members'
  get '/tournaments/matches/:id' => 'tournaments#matches'
  get '/tournaments/curr_user_is_in_tournament/:id' => 'tournaments#curr_user_is_in_tournament'

# --------------------
#    AUTHENTIFICATION
# --------------------
  post 'users/enable_otp' => 'users#enable_otp'
  post 'users/disable_otp' => 'users#disable_otp'
  post 'users/edit/enable_otp' => 'users#enable_otp'
  post 'users/edit/disable_otp' => 'users#disable_otp'
  get 'users/edit/profile/0' => 'profile'

  devise_for :users, controllers: { omniauth_callbacks: "users/omniauth_callbacks" }
  devise_scope :user do
    delete 'sign_out', :to => 'devise/sessions#destroy', :as => :destroy_user_session_path
    post '/users/auth/marvin/twofa' => 'users/omniauth_callbacks#twofa'
  end

  # def after_sign_in_path_for(resource)
  #   guilds_path 
  # end
  
end
