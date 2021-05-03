class DeleteWarJob < ApplicationJob
  queue_as :default

  def perform(war)
    if war.is_accepted == false
      war.destroy
    end
  end
end
