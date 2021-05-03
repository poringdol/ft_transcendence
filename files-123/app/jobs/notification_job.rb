class NotificationJob < ApplicationJob
  queue_as :default

  def perform(params)
    notify = Notification.create!(user_id: params[:user].id, message: params[:message], link: params[:link])

    html = ApplicationController.render(
      partial: 'layouts/notification',
      locals: { message: params[:message], link: params[:link], id: notify.id}
    )
    html2 = ApplicationController.render(partial: 'layouts/n_notification')

    NotificationChannel.broadcast_to(params[:user], html: html, html2: html2)
  end
end
