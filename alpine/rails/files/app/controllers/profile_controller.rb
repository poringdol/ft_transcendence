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

# Returns current user in JSON
  def get_curr_user
    render json: current_user
  end

  def get_guild
	guild = Guild.find(params[:guild_id])
	render json: guild
  end

end
