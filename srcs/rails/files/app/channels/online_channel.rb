
class OnlineChannel < ApplicationCable::Channel
  def subscribed
    # Save online status
    ActionCable.server.pubsub.redis_connection_for_subscriptions.sadd "online", current_user.id

    stream_from "online:users"

    html = ApplicationController.render(partial: "rooms/online_now", locals: { user: current_user })
    broadcast_to "users", { id: current_user.id, status: "online", html: html }
  end

  def unsubscribed
    # Remove online status
    ActionCable.server.pubsub.redis_connection_for_subscriptions.srem "online", current_user.id

    html = ApplicationController.render(partial: "rooms/offline_now", locals: { user: current_user })
    broadcast_to "users", { id: current_user.id, status: "offline", html: html }
  end
end
