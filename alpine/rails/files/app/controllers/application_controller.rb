class ApplicationController < ActionController::Base
  respond_to :html, :js, if: :devise_controller?
  before_action :authenticate_user!
  before_action :all_users
  before_action :configure_permitted_parameters, if: :devise_controller?
  before_action :banned?

  def all_users
    all_users = User.all
    # p '------------------------------------'

    # p '===================================='
  end

  protected

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: [:nickname])
    devise_parameter_sanitizer.permit(:account_update, keys: [:nickname])
  end

  def banned?
    if current_user.present? && current_user.is_banned?
      sign_out current_user
      flash[:error] = "This account has been suspended...."
      root_path
    end
  end
end
