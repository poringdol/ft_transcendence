class NotificationController < ApplicationController
  skip_before_action :verify_authenticity_token

  def destroy
    notify = Notification.where(id: params[:id]).first
    p '----------------------------------'
    p  notify
    p '----------------------------------'
    if notify.present?
      notify.destroy
    end
    #render json: status: :ok
  end
end
