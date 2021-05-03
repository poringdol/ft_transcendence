class WarUpdateJob < ApplicationJob
  queue_as :default

  def perform(war, action)
    
    if action == "start"
      war.guild1.update(war: war)
      war.guild2.update(war: war)
      war.update(is_inprogress: true)

    elsif action == "end"
      if war.is_end == true
        return
      end

      war.guild1.update(war: nil)
      war.guild2.update(war: nil)
      war.is_inprogress = false
      war.is_end = true

      if war.guild1_wins > war.guild2_wins
        war.guild1.score += war.prize
        war.guild2.score -= war.prize
      elsif war.guild1_wins < war.guild2_wins
        war.guild1.score -= war.prize
        war.guild2.score += war.prize
      end

      war.guild1.save
      war.guild2.save
      war.save
    end
  end 
end
