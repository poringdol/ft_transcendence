class PingpongChannel < ApplicationCable::Channel
  def subscribed
    stream_from "pingpong_channel"
    console.log("CONNECTED TO CABLE")
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end
end
