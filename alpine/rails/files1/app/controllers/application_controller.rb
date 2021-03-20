class ApplicationController < ActionController::Base
    respond_to :html, :js, if: :devise_controller?
    before_action :authenticate_user!
    before_action :all_users
    before_action :configure_permitted_parameters, if: :devise_controller?

    def all_users
        all_users = User.all
    end

    

    protected

    def configure_permitted_parameters
        devise_parameter_sanitizer.permit(:sign_up, keys: [:nickname])
        devise_parameter_sanitizer.permit(:account_update, keys: [:nickname])
    end

end
