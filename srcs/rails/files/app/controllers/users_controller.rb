class UsersController < ApplicationController
  # skip_before_action :verify_authenticity_token

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

  def index
    @user = User.order(:score).reverse
    respond_to do |format|
      format.html { @user }
      format.json { render json: @user }
    end
  end

  def show
    @user = User.all.find(params[:id, :encrypted_otp_secret, :encrypted_otp_secret_iv, :encrypted_otp_secret_salt])
    render json: @user
  end

  def edit
    redirect_to '/users/edit'
  end

  def update_nickname
    p "update_nickname"
    p "update_nickname"
    p "update_nickname"
    p "update_nickname"
    p "update_nickname"
    p params
    p "update_nickname"
    p "update_nickname"
    p "update_nickname"
    p "update_nickname"
    if current_user.nickname != params[:user][:nickname]
      current_user.nickname = params[:user][:nickname]
      current_user.save!
      NotificationJob.perform_later({
        user: current_user,
        message: "Nickname changed to #{current_user.nickname}",
        link: ''
      })
      render json: { }, status: :ok
    else
      render json: { error: 'This nickname is already in use' }, status: :unprocessable_entity
    end
  end

  def update_avatar
    if params[:user]
      File.open(params[:user][:avatar]) do |f|
        current_user.avatar = f
      end
      current_user.save!
      NotificationJob.perform_later({
        user: current_user,
        message: "Avatar updated",
        link: ''
      })
    else
      NotificationJob.perform_later({
        user: current_user,
        message: "Choose file",
        link: ''
      })
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
        NotificationJob.perform_later({
          user: current_user,
          message: "User #{User.find(blocked_user_id).nickname} now in your block list",
          link: ''
        })
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
    NotificationJob.perform_later({
      user: current_user,
      message: "User #{User.find(blocked_user_id)} removed from block list",
      link: ''
    })
  end

  def online
    online_users = User.all.online().select(:id, :encrypted_otp_secret, :encrypted_otp_secret_iv, :encrypted_otp_secret_salt)
    return render json: online_users
  end

  def users_list
    # @user = User.select(:id, :nickname, :encrypted_otp_secret).order(:nickname)
	@user = User.select(:id, :nickname, :encrypted_otp_secret, :encrypted_otp_secret_iv, :encrypted_otp_secret_salt).order(:nickname)
    render json: @user
  end

  private

end
