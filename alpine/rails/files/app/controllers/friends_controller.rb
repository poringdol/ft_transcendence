class FriendsController < ApplicationController
  before_action :set_friend, only: %i[ show edit update destroy ]

  # GET /friends or /friends.json
  def index
    @friends = Friend.all
  end

  # GET /friends/1 or /friends/1.json
  def show
  end

  # GET /friends/new
  def new
    @friend = Friend.new
  end

  # GET /friends/1/edit
  def edit
  end

  def send_request
	user_is_following_you = Friend.find_by(user_id: params[:id], friend_id: current_user.id)
	you_are_following_user = Friend.find_by(user_id: current_user.id, friend_id: params[:id])
	
	if (user_is_following_you == nil && 
		you_are_following_user == nil)
			@friend = Friend.new(user_id: current_user.id, friend_id: params[:id])
			respond_to do |format|
				if @friend.save
					format.any { render json: 1, status: :created}
				else
					format.any { render json: ['unprocessable_entity'], notice: "unprocessable_entity" ,status: :unprocessable_entity }
				end
			end
	elsif (user_is_following_you != nil && you_are_following_user != nil)
		respond_to do |format|
			format.any { render json: ['You are already friends'], notice: "You are already friends" ,status: :unprocessable_entity }
		end
	elsif (user_is_following_you != nil)
		respond_to do |format|
			format.any { render json: ['This user is following you'], notice: "This user is following you" ,status: :unprocessable_entity }
		end
	else (you_are_following_user != nil)
		respond_to do |format|
			format.any { render json: ['You are already following this user'], notice: "You are already following this user" ,status: :unprocessable_entity }
		end
	end
  end

  def follow_back
	user_is_following_you = Friend.find_by(user_id: params[:id], friend_id: current_user.id)
	you_are_following_user = Friend.find_by(user_id: current_user.id, friend_id: params[:id])
	if (user_is_following_you && 
		you_are_following_user == nil && 
		user_is_following_you.is_friend == false)
			@friend = Friend.new(user_id: current_user.id, friend_id: params[:id], is_friend: true)
			user_is_following_you.is_friend = true
			user_is_following_you.save
			respond_to do |format|
				if @friend.save
					format.any { render json: 1, status: :created}
				else
					format.any { render json: ['unprocessable_entity'], notice: "unprocessable_entity" ,status: :unprocessable_entity }
				end
			end
	else
		puts("ssssssssssssssss")
		puts("ssssssssssssssss")
		respond_to do |format|
			format.any { render json: ['hhh'], each_serializer: ErrorSerializer }
		end
	end
  end

  def delete_from_friends
	user_is_following_you = Friend.find_by(user_id: params[:id], friend_id: current_user.id)
	you_are_following_user = Friend.find_by(user_id: current_user.id, friend_id: params[:id])

	if (user_is_following_you && you_are_following_user)
		you_are_following_user.destroy
		user_is_following_you.is_friend = false
		respond_to do |format|
			if user_is_following_you.save
				format.any { render json: 1, status: :created}
			else
				format.any { render json: user_is_following_you.errors, status: :unprocessable_entity }
			end
		end
	else
		respond_to do |format|
			format.any { render json: ['You are not friends'], notice: "You are not friends" ,status: :unprocessable_entity }
		end
	end
  end

  def unfollow_user
	user_is_following_you = Friend.find_by(user_id: params[:id], friend_id: current_user.id)
	you_are_following_user = Friend.find_by(user_id: current_user.id, friend_id: params[:id])

	if (user_is_following_you == nil && you_are_following_user)
		you_are_following_user.destroy
		respond_to do |format|
			format.any { render json: 1, status: :created}
		end
	elsif (you_are_following_user == nil)
		respond_to do |format|
			format.any { render json: ['You are not following this user'], notice: "You are not following this user" ,status: :unprocessable_entity }
		end
	else
		respond_to do |format|
			format.any { render json: ['This user is following you'], notice: "This user is following you" ,status: :unprocessable_entity }
		end
	end
  end


  # POST /friends or /friends.json
  def create
    @friend = Friend.new(user_id: params[:user_id], friend_id: params[:friend_id])

    respond_to do |format|
      if @friend.save
        format.html { redirect_to @friend, notice: "Friend was successfully created." }
        format.json { render :show, status: :created, location: @friend }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @friend.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /friends/1 or /friends/1.json
  def update
    respond_to do |format|
      if @friend.update(friend_params)
        format.html { redirect_to @friend, notice: "Friend was successfully updated." }
        format.json { render :show, status: :ok, location: @friend }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @friend.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /friends/1 or /friends/1.json
  def destroy
    @friend.destroy
    respond_to do |format|
      format.html { redirect_to friends_url, notice: "Friend was successfully destroyed." }
      format.json { head :no_content }
    end
  end

  def get_friends
    @friends = Friend.select(:friend_id).where(user_id: params[:id])
    render json: @friends
  end

  def get_followers
    followers = Friend.select(:user_id).where(friend_id: params[:id], is_friend: false)
	# render :json => followers.to_json
	render json: followers, each_serializer: FollowerSerializer
  end

  def is_friend
	user = Friend.find_by(user_id: current_user.id, friend_id: params[:id])
	if user == nil
		user = Friend.find_by(user_id: params[:id], friend_id: current_user.id)
		if user == nil
			render json: 0		 # they are not friends
		else
			render json: 3		 # user is following you
		end
	elsif user.is_friend == true # they are friends
		render json: 1
	else						 # you are following user
		render json: 2
	end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_friend
      @friend = Friend.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def friend_params
      params.require(:friend).permit(:user_id, :friend_id)
    end
end
