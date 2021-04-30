class DeleteGameInviteJob < ApplicationJob
  queue_as :default

  def perform(match)
    if match.is_inprogress == false && match.is_end == false
      match.destroy
    end
  end
end
