class NotificationController < ApplicationController
  def destroy
    notify = Notification.where(id: params[:id]).first
    if notify.present?
      notify.destroy
    end
  end
end
