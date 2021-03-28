class UsersController < ApplicationController
  def disable_otp
    current_user.otp_required_for_login = false
    current_user.save!
    redirect_to edit_user_registration_path
  end

  def enable_otp
    current_user.otp_secret = User.generate_otp_secret
    current_user.otp_required_for_login = true
    current_user.save!
    redirect_to edit_user_registration_path
  end

  def update_avatar
    File.open(params[:avatar]) do |f|
      current_user.avatar = f
    end
    current_user.save!
    redirect_to '/user'
  end
end
