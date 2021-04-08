class OnlineStatusChannel < ApplicationCable::Channel
  def subscribed
    stream_from "online_status_channel"
    connected()
  end
  
  def unsubscribed
    disconnected()
  end
  
  def connected
    current_user.update!(is_online: true)
  end
  
  def disconnected
    current_user.update!(is_online: false)
  end

end
