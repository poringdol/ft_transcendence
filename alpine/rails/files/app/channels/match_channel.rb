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
    # REDIS.set "match_#{params[:id]}:br1", data["bracket1"]
    # REDIS.set "match_#{params[:id]}:br2", data["bracket2"]
    
    ActionCable.server.broadcast "match_channel_#{data["match_id"]}", { match_id: data["match_id"],
                                                                        player: data["player"],
                                                                        key_code: data["key_code"],
                                                                        bracket1: data["bracket1"],
                                                                        bracket2: data["bracket2"]}
  end
  
  def reset_ball(data)
    ActionCable.server.broadcast "match_channel_#{params[:match_id]}", { match_id: data["match_id"],
                                                                         player: data["player"],
                                                                         key_code: data["key_code"]}
  end
  
  def command(data)
    ActionCable.server.broadcast "match_channel_#{params[:match_id]}", { match_id: data["match_id"],
                                                                         player: data["player"],
                                                                         key_code: data["key_code"],
                                                                         score: data["score"]}
  end
  
  def save_state(data)
    REDIS.set "state:#{data["match_id"]}", data["state"]
    REDIS.set "player:#{data["match_id"]}", data["player"]

    ActionCable.server.broadcast "match_channel_#{params[:match_id]}", { match_id: data["match_id"],
                                                                         key_code: data["key_code"],
                                                                         state: data["state"],
                                                                         player: data["player"]}
  end
  
  def get_state(data)
    state = REDIS.get "state:#{data["match_id"]}"
    player = REDIS.get "player:#{data["match_id"]}"

    ActionCable.server.broadcast "match_channel_#{params[:match_id]}", { match_id: data["match_id"],
                                                                         key_code: data["key_code"],
                                                                         state: state,
                                                                         player: player}
  end

end
