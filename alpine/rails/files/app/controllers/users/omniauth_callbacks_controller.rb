class Users::OmniauthCallbacksController < Devise::OmniauthCallbacksController
    def marvin
      @user = User.from_omniauth(request.env["omniauth.auth"])
  
      if @user.persisted?
        sign_in_and_redirect @user, :event => :authentication
        set_flash_message(:notice, :success, :kind => "42") if is_navigational_format?
      else
        session["devise.marvin_data"] = request.env["omniauth.auth"]
        redirect_to new_user_registration_url
      end
    end

     # GET|POST /resource/auth/marvin
	  def passthru
        super
    end

    # GET|POST /users/auth/marvin/callback
    def failure
        flash[:alert] = "Failed to Sign in 42"
        redirect_to root_path
    end

    protected

    # The path used when OmniAuth fails
    def after_omniauth_failure_path_for(scope)
        super(scope)
    end

  end