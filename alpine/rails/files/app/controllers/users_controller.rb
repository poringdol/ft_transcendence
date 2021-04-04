class UsersController < ApplicationController
  def disable_otp
    current_user.otp_required_for_login = false
    current_user.save!
    redirect_to '/users/edit'
  end

  def show
    @user = User.all.find(params[:id])
    return render json: @user
  end

  def edit
    redirect_to '/users/edit'
  end

  def enable_otp
    current_user.otp_secret = User.generate_otp_secret
    current_user.otp_required_for_login = true
    current_user.save!
    redirect_to '/users/edit'
  end

  def update_nickname
    current_user.nickname = params[:user][:nickname]
    current_user.save!
    redirect_to '/users/edit'
  end

  def update_avatar
    if params[:user]
      File.open(params[:user][:avatar]) do |f|
        current_user.avatar = f
      end
      current_user.save!
      redirect_to '/users/edit'
    end
  end

  def block_user
    p "-------------------------"
    p params
    p "-------------------------"
    Blocklist.create(user_id: params[:user_id], blocked_user_id: params[:blocked_user_id])
  end

  def unblock_user
    p "-------------------------"
    p params
    p "-------------------------"
    Blocklist.where(user_id: params[:user_id], blocked_user_id: params[:blocked_user_id]).destroy_all
  end
end
