class UnansweredWarMatchJob < ApplicationJob
  queue_as :default

  def perform(match, war)

    p "unanswered_war_match_job unanswered_war_match_job unanswered_war_match_job "
    p "unanswered_war_match_job unanswered_war_match_job unanswered_war_match_job "
    p match
    p "unanswered_war_match_job unanswered_war_match_job unanswered_war_match_job "
    p "unanswered_war_match_job unanswered_war_match_job unanswered_war_match_job "
    p war
    p "unanswered_war_match_job unanswered_war_match_job unanswered_war_match_job "
    p "unanswered_war_match_job unanswered_war_match_job unanswered_war_match_job "

    if match.player2.nil?
      match.player1_score = 1
      match.rating = 1
      match.is_end = true
      match.save
      
      match.player1.score += 1
      match.player1.save
      
      match.guild_1.score += 1
      match.guild_1.save
      
      war.unanswered += 1
      war.guild_1_wins += 1
      war.save

      if war.unanswered > war.max_unanswered
        war.is_inprogress = false
        war.is_end = true

        if war.guild_1_wins > war.guild_2_wins
          war.guild1.score += war.prize
          war.guild2.score -= war.prize
        elsif war.guild_1_wins < war.guild_2_wins
          war.guild1.score -= war.prize
          war.guild2.score += war.prize
        end
        war.save
      end
    end
  end
end
