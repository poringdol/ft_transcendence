class UsersController < ApplicationController
  skip_before_action :verify_authenticity_token

  def enable_otp
    current_user.otp_secret = User.generate_otp_secret
    current_user.otp_required_for_login = true
    current_user.save!
    redirect_to '/users/edit'
  end

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

  def update_nickname
    p "----------------------"
    p params
    p "----------------------"
    if current_user.nickname != params[:user][:nickname]
      current_user.nickname = params[:user][:nickname]
      current_user.save!
      NotificationChannel.broadcast_to(current_user, message: "Nickname changed to #{current_user.nickname}")
     # redirect_to '/profile/0'
    else
      NotificationChannel.broadcast_to(current_user, message: "Choose other nickname")
    end
  end

  def update_avatar
    if params[:user]
      File.open(params[:user][:avatar]) do |f|
        current_user.avatar = f
      end
      current_user.save!
      NotificationChannel.broadcast_to(current_user, message: "Avatar updated")
      # redirect_to '/users/edit'
    else
      NotificationChannel.broadcast_to(current_user, message: "Choose file")
    end
  end

  def block_user
    if params[:room].present?
      user_id = params[:room][:user_id]
      blocked_user_id = params[:room][:blocked_user_id]
    else
      user_id = params[:user_id]
      blocked_user_id = params[:blocked_user_id]
    end

    blocked = Blocklist.find_by(user_id: user_id, blocked_user_id: blocked_user_id)
    unless blocked
        Blocklist.create(user_id: user_id, blocked_user_id: blocked_user_id)
        NotificationChannel.broadcast_to(current_user, message: "User #{User.find(blocked_user_id).nickname} now in your block list")
    end
  end

  def unblock_user
    if params[:room].present?
      user_id = params[:room][:user_id]
      blocked_user_id = params[:room][:blocked_user_id]
    else
      user_id = params[:user_id]
      blocked_user_id = params[:blocked_user_id]
    end

    Blocklist.where(user_id: user_id, blocked_user_id: blocked_user_id).destroy_all
    NotificationChannel.broadcast_to(current_user, message: "User #{User.find(blocked_user_id)} removed from block list")
  end

end
