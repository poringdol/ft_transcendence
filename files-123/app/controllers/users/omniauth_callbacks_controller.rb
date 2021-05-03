class Users::OmniauthCallbacksController < Devise::OmniauthCallbacksController
    def marvin
      @user = User.from_omniauth(request.env["omniauth.auth"])

      if @user.persisted?
        if @user.is_banned?
          flash[:alert] = "Failed to Sign in, you banned"
          return redirect_to user_session_path
        end
        if @user.otp_required_for_login?
          return render '/devise/sessions/_twofa'
        end
        sign_in_and_redirect @user, :event => :authentication
        set_flash_message(:notice, :success, :kind => "42") if is_navigational_format?
      else
        session["devise.marvin_data"] = request.env["omniauth.auth"]
        redirect_to root_path
      end
    end

    def twofa
      user = User.find(params[:user][:user_id])
      if user.validate_and_consume_otp!(params[:user][:otp_attempt])
        sign_in_and_redirect user, :event => :authentication
      else
        flash[:alert] = "Failed to Sign in, otp is wrong"
        redirect_to user_session_path
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
