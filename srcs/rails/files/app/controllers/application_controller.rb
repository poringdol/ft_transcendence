class ApplicationController < ActionController::Base
  respond_to :html, :js, if: :devise_controller?
  before_action :authenticate_user!
  before_action :all_users
  before_action :configure_permitted_parameters, if: :devise_controller?
  before_action :banned?

  rescue_from ActiveRecord::RecordNotFound, with: :not_found
  rescue_from Exception, with: :not_found
  rescue_from ActionController::RoutingError, with: :not_found

  def raise_not_found
    raise ActionController::RoutingError.new("No route matches #{params[:unmatched_route]}")
  end

  def not_found
    respond_to do |format|
      format.html { render file: "#{Rails.root}/public/404", layout: false, status: :not_found }
      format.xml { head :not_found }
      format.any { head :not_found }
    end
  end

  def error
    respond_to do |format|
      format.html { render file: "#{Rails.root}/public/500", layout: false, status: :error }
      format.xml { head :not_found }
      format.any { head :not_found }
    end
  end

  def all_users
    all_users = User.all
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
