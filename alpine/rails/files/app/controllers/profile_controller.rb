class ProfileController < ApplicationController
  skip_before_action :verify_authenticity_token

  def index
	  @user = current_user
    respond_to do |format|
      format.html { current_user }
      format.json { render json: current_user}
    end
  end

  def index_id
    respond_to do |format|
      format.html { 
        @user = User.find(params[:id])
        @user
	    }
      format.json { render json: @user}
    end
  end

  def add_friends
    friend = Friend.create(user_id: current_user, friend_id: User.find(5))
    friend = Friend.create(user_id: current_user, friend_id: User.find(6))
    friend = Friend.create(user_id: current_user, friend_id: User.find(7))
    render json: friend
  end

  def get_friends
    friend = Friend.all
    render json: friend
  end

  def get_user_friends
    # friends = Friend.select(:friend_id).where(user_id: params[:id])
    # friends = Friend.where(user_id: User.find(params[:id]))
    render json: friends
  end

  def get_user
    @user = User.find(params[:id])
    render json: @user
  end

  def get_user_friends2
	# friends = Friend.select(:friend_id).where(user_id: params[:id])
    friends = Friend.where(user_id: 1)
    render json: friends
  end

# Returns current user in JSON
  def get_curr_user
    render json: current_user
  end

  def get_guild
    guild = Guild.find(params[:guild_id])
    render json: guild
  end

end
