class UnansweredWarMatchJob < ApplicationJob
  queue_as :default

  def perform(match, war)

    if match.player2.nil?

      match.player1_score = 1
      match.rating = 1
      match.is_end = true
      match.save
      
      match.player1.score += 1
      match.player1.save
      
      match.guild1.score += 1
      match.guild1.save
      
      war.guild1 == match.guild1 ? war.unanswered2 += 1 : war.unanswered1 += 1
      war.guild1 == match.guild1 ? war.guild1_wins += 1 : war.guild2_wins += 1
      war.save

      if war.unanswered1 > war.max_unanswered || war.unanswered2 > war.max_unanswered
        war.is_inprogress = false
        war.is_end = true

        # Вне зависимости от счета, проигрывает команда, не ответившая на вызовы
        if war.unanswered2 > war.max_unanswered
          war.guild1.score += war.prize
          war.guild2.score -= war.prize
        elsif war.unanswered1 > war.max_unanswered
          war.guild1.score -= war.prize
          war.guild2.score += war.prize
        end
        war.save
      end
    end
  end
end
