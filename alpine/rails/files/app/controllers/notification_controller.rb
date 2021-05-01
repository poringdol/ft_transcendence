class NotificationController < ApplicationController
  skip_before_action :verify_authenticity_token

  def destroy
    notify = Notification.where(id: params[:id]).first
    if notify.present?
      notify.destroy
    end
  end
end
