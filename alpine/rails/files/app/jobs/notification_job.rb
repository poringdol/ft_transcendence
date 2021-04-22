class NotificationJob < ApplicationJob
  queue_as :default

  def perform(params)
    # p '--------------------'
    # p params
    # p '--------------------'
    html = ApplicationController.render(
      partial: 'layouts/notification',
      locals: { message: params[:message], link: params[:link] }
    )
    html2 = ApplicationController.render(partial: 'layouts/n_notification')
    # p '++++++++++++++++++++'
    # p html
    # p '++++++++++++++++++++'
    NotificationChannel.broadcast_to(params[:user], html: html, html2: html2)
  end
end
