class PingpongChannel < ApplicationCable::Channel
  def subscribed
    stream_from "pingpong_channel"
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end
end
