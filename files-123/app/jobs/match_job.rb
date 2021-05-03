class MatchJob < ApplicationJob
  queue_as :default

  # def perform(params)
  #   ActionCable.server.broadcast "match_channel_#{params[:match_id]}", { match_id: params[:match_id],
  #                                                                       key_code: params[:key_code],
  #                                                                       bracket1: params[:bracket1],
  #                                                                       bracket2: params[:bracket2],
  #                                                                       ball_pos: params[:ball_pos]}
  # end
end
