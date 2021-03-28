class UsersController < ApplicationController
  def disable_otp
    current_user.otp_required_for_login = false
    current_user.save!
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
    redirect_to '/user'
  end

  def update_avatar
    if params[:user]
      File.open(params[:user][:avatar]) do |f|
        current_user.avatar = f
      end
      current_user.save!
      redirect_to '/user'
    end
  end
end
