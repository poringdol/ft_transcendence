class TournamentUpdateJob < ApplicationJob
  queue_as :default

  def perform(tournament, action)
    
    if action == "start"

      users = TournamentUser.where(tournament_id: tournament.id)
      # начать турнир, создать матчи каждый с каждым
      if users.empty?
        tournament.destroy
        return
      end
      tournament.update(is_inprogress: true)
      # для входа в игру две кнопк - войти в рейтинговую игру или безрейтинговую
      # выводить во время матча рейтинговая игра или нет
      for i in 0...users.size()
        for j in i + 1...users.size()
          match = Match.create(player1: users[i].user(), player2: users[j].user, guild1: users[i].user.guild, guild2: users[j].user.guild, addons_id: tournament.addons.id)
          TournamentMatch.create(tournament: tournament, match: match)
        end
      end
    elsif action == "end"
      # завершить турнир, выявить победителя
      tournament.update(is_inprogress: false)
      tournament.update(is_end: true)

      matches = TournamentMatch.where(tournament_id: tournament.id)
      matches.each do |m|
        m.match.update(is_inprogress: false, is_end: true)
        ActionCable.server.broadcast "match_channel_#{m.match.id}", { match_id: m.match.id, player: -1, key_code: 132} # key_code: 132 - define in match_channel.js
      end

      result = TournamentUser.order(wins: :desc, loses: :asc, score: :desc)
      curr_scores = result[0].user.score
      result[0].user.update(score: curr_scores + tournament.prize)

    end
  end
end
