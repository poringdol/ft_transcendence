class MuteJob < ApplicationJob
  queue_as :default

  def perform(user)
    user.is_muted = false
    user.save
  end
end
