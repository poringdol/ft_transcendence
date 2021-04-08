class MatchChannel < ApplicationCable::Channel
  def subscribed
    stream_from "match_channel_#{params[:match_id]}"
  end

  def unsubscribed
  end

  def move_bracket(data)

    # REDIS.set "backet1_pos:#{params[:id]}", params[:bracket1_pos]
    # REDIS.set "backet1_pos:#{params[:id]}", params[:bracket2_pos]
    # REDIS.set "backet1_pos:#{params[:id]}", params[:ball_pos]

    # MatchJob.perform_later({ match_id: data["match_id"],
    #                         key_code: data["key_code"],
    #                         bracket1: data["bracket1"],
    #                         bracket2: data["bracket2"],
    #                         ball_pos: data["ball_pos"]})
    ActionCable.server.broadcast "match_channel_#{data["match_id"]}", { match_id: data["match_id"],
                                                                        player: data["player"],
                                                                        key_code: data["key_code"],
                                                                        bracket1: data["bracket1"],
                                                                        bracket2: data["bracket2"],
                                                                        ball_pos: data["ball_pos"]}
  end

end
