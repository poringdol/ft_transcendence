class MatchJob < ApplicationJob
  queue_as :default

  def perform(params)
    ActionCable.server.broadcast "match_channel_#{params[:match_id]}", { match_id: params[:match_id],
                                                                         key_code: params[:key_code],
                                                                         player: params[:player],
                                                                         bracket: params[:bracket]}
  end
end
