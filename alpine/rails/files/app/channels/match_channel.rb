class MatchChannel < ApplicationCable::Channel
  def subscribed
    p "////////////////////////////////////"
    # p current_user.id
    p "************************************"
    stream_from "match_channel_#{params[:match_id]}"
  end

  def unsubscribed
  end
end
# 