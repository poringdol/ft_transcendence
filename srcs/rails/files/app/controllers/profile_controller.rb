class ProfileController < ApplicationController
  skip_before_action :verify_authenticity_token

  def index
    @user = current_user
    respond_to do |format|
      format.html { current_user }
      format.json { render json: current_user}
    end
  end

  def get_user
    @user = User.find(params[:id])
    render json: @user
  end

# Returns current user in JSON
  def get_curr_user
    render json: current_user
  end

  def ban_user
    user = User.find(params[:id])
    if (user && current_user.is_admin == true)
      user.is_banned = true
      respond_to do |format|
        if user.save
          format.any { render json: 1, status: :created}
        else
          format.any { render json: ['unprocessable_entity'], notice: "unprocessable_entity" ,status: :unprocessable_entity }
        end
      end
    end
  end

  def unban_user
    user = User.find(params[:id])
    if (user && current_user.is_admin == true && user.is_banned == true)
      user.is_banned = false
      respond_to do |format|
        if user.save
          format.any { render json: 1, status: :created}
        else
          format.any { render json: ['unprocessable_entity'], notice: "unprocessable_entity" ,status: :unprocessable_entity }
        end
      end
    end
  end

  def do_moderator_user
    user = User.find(params[:id])
    if (user && current_user.is_admin == true)
      user.is_moderator = true
      respond_to do |format|
        if user.save
          format.any { render json: 1, status: :created}
        else
          format.any { render json: 0, notice: "unprocessable_entity" ,status: :unprocessable_entity }
        end
      end
    end
  end

  def undo_moderator_user
    user = User.find(params[:id])
    if (user && current_user.is_admin == true)
      user.is_moderator = false
      respond_to do |format|
        if user.save
          format.any { render json: 1, status: :created}
        else
          format.any { render json: 0, notice: "unprocessable_entity" ,status: :unprocessable_entity }
        end
      end
    end
  end

  def block_list
    @block = Blocklist.where(user_id: current_user.id)
    render json: @block
  end

  def block_list_detailed
    @block = Blocklist.where(user_id: params[:id])
    render json: @block, each_serializer: BlocklistDetailedSerializer
  end

end
