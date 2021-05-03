user = User.create!(email: 'polinaria@a.a', nickname: 'polinaria', is_admin: true, password: 'polinaria', password_confirmation: 'polinaria', wins: 3)
guild = Guild.create!(name: 'Creators', anagram: 'CRT', score: 100, rating: 1, owner_id: User.where(nickname: 'polinaria').first.id)
guild.update_column :logo, 'cat_mem.jpg'

user = User.create!(email: 'cddoma@a.a',   nickname: 'cddoma',   is_admin: true, avatar: 'dog.jpg', guild_id: guild.id, password: 'cddoma',   password_confirmation: 'cddoma', loses: 1, wins: 3)
user = User.create!(email: 'alldeady@a.a', nickname: 'alldeady', is_admin: true, avatar: 'cat.jpg', guild_id: guild.id, password: 'alldeady', password_confirmation: 'alldeady', loses: 1, wins: 3)

User.create!(email: 'splinter@a.a', nickname: 'splinter', password: 'splinter', password_confirmation: 'splinter', loses: 3, wins: 1)
guild = Guild.create(name: 'Ninja Turtles', anagram: 'TMNT', score: 80, rating: 3, owner_id: User.where(nickname: 'splinter').first.id)
guild.update_column :logo, 'tmnt.jpg'

User.create!(email: 'leonardo@a.a',     nickname: 'leonardo',     guild_id: guild.id,					password: 'leonardo',     password_confirmation: 'leonardo', wins: 1)
User.create!(email: 'donatello@a.a',    nickname: 'donatello',    guild_id: guild.id, is_officer: true, password: 'donatello',    password_confirmation: 'donatello', loses: 1)
User.create!(email: 'raphael@a.a',      nickname: 'raphael',      guild_id: guild.id,                   password: 'raphael',      password_confirmation: 'raphael', loses: 1)
User.create!(email: 'michelangelo@a.a', nickname: 'michelangelo', guild_id: guild.id, is_banned: true,  password: 'michelangelo', password_confirmation: 'michelangelo', wins: 1)

User.create!(email: 'rick_sanchez@a.a', nickname: 'rick_sanchez', password: 'rick_sanchez', password_confirmation: 'rick_sanchez', loses: 1, wins: 2)
guild = Guild.create(name: 'Rick and Morty', anagram: 'R&M', score: 90, rating: 2, owner_id: User.where(nickname: 'rick_sanchez').first.id)
guild.update_column :logo, 'rick_morty.jpg'

User.create!(email: 'morty_smith@a.a', nickname: 'morty_smith', guild_id: guild.id, password: 'morty_smith', password_confirmation: 'morty_smith', loses: 2, wins: 0)

User.where(nickname: 'polinaria').first.update_column :avatar, 'girl.jpg'
User.where(nickname: 'cddoma').first.update_column :avatar, 'dog.jpg'
User.where(nickname: 'alldeady').first.update_column :avatar, 'cat.jpg'
User.where(nickname: 'splinter').first.update_column :avatar, 'splinter.jpg'
User.where(nickname: 'leonardo').first.update_column :avatar, 'leo.jpg'
User.where(nickname: 'donatello').first.update_column :avatar, 'don.jpg'
User.where(nickname: 'raphael').first.update_column :avatar, 'raph.jpg'
User.where(nickname: 'michelangelo').first.update_column :avatar, 'mike.jpg'
User.where(nickname: 'rick_sanchez').first.update_column :avatar, 'rick.jpg'
User.where(nickname: 'morty_smith').first.update_column :avatar, 'morty.jpg'

Friend.create(user_id: 1, friend_id: 2, is_friend: true)
Friend.create(user_id: 1, friend_id: 3, is_friend: true)
Friend.create(user_id: 1, friend_id: 4, is_friend: true)
Friend.create(user_id: 1, friend_id: 6, is_friend: true)
Friend.create(user_id: 1, friend_id: 7)
Friend.create(user_id: 1, friend_id: 8)
Friend.create(user_id: 1, friend_id: 9)

Friend.create(user_id: 2, friend_id: 1, is_friend: true)
Friend.create(user_id: 3, friend_id: 1, is_friend: true)
Friend.create(user_id: 4, friend_id: 1, is_friend: true)
Friend.create(user_id: 5, friend_id: 1, is_friend: true)
Friend.create(user_id: 6, friend_id: 1, is_friend: true)

Friend.create(user_id: 2, friend_id: 3)
Friend.create(user_id: 2, friend_id: 5)
Friend.create(user_id: 2, friend_id: 6)
Friend.create(user_id: 2, friend_id: 7)
Friend.create(user_id: 2, friend_id: 8)
Friend.create(user_id: 2, friend_id: 9)

Friend.create(user_id: 3, friend_id: 10)
Friend.create(user_id: 3, friend_id: 11)

Friend.create(user_id: 10, friend_id: 1)
Friend.create(user_id: 11, friend_id: 1)

GuildInvite.create(inviter_id: 2, invited_id: 1, guild_id: 1)
GuildInvite.create(inviter_id: 7, invited_id: 1, guild_id: 2)
GuildInvite.create(inviter_id: 1, invited_id: 6, guild_id: 1)
GuildInvite.create(inviter_id: 1, invited_id: 4, guild_id: 1)

Tournament.create(name: "Best of the best", start: DateTime.now - 3.hour, end: DateTime.now - 5.minutes, prize: 10, is_inprogress: false, is_end: true)
TournamentUser.create(tournament_id: 1, user_id: 1, wins: 3, score: 21)
TournamentUser.create(tournament_id: 1, user_id: 2, wins: 1, loses: 1, score: 14)
TournamentUser.create(tournament_id: 1, user_id: 3, wins: 1, loses: 1, score: 17)
TournamentUser.create(tournament_id: 1, user_id: 4, wins: 0, loses: 3, score: 15)

m = Match.create(player1_id: 1, player2_id: 2, guild1_id: 1, guild2_id: 1, is_end: true, player1_score: 7, player2_score: 2)
TournamentMatch.create(tournament_id: 1, match_id: m.id)
m = Match.create(player1_id: 1, player2_id: 3, guild1_id: 1, guild2_id: 1, is_end: true, player1_score: 7, player2_score: 5)
TournamentMatch.create(tournament_id: 1, match_id: m.id)
m = Match.create(player1_id: 1, player2_id: 4, guild1_id: 1, guild2_id: 2, is_end: true, player1_score: 7, player2_score: 5)
TournamentMatch.create(tournament_id: 1, match_id: m.id)
m = Match.create(player1_id: 2, player2_id: 3, guild1_id: 1, guild2_id: 1, is_end: true, player1_score: 5, player2_score: 5)
TournamentMatch.create(tournament_id: 1, match_id: m.id)
m = Match.create(player1_id: 2, player2_id: 4, guild1_id: 1, guild2_id: 2, is_end: true, player1_score: 7, player2_score: 5)
TournamentMatch.create(tournament_id: 1, match_id: m.id)
m = Match.create(player1_id: 3, player2_id: 4, guild1_id: 1, guild2_id: 2, is_end: true, player1_score: 7, player2_score: 5)
TournamentMatch.create(tournament_id: 1, match_id: m.id)

Tournament.create(name: "Next contest", start: DateTime.now + 10.minutes, end: DateTime.now + 30.minutes, prize: 15)
TournamentUser.create(tournament_id: 2, user_id: 1)
TournamentUser.create(tournament_id: 2, user_id: 2)
TournamentUser.create(tournament_id: 2, user_id: 3)
TournamentUser.create(tournament_id: 2, user_id: 9)
TournamentUser.create(tournament_id: 2, user_id: 10)

War.create(guild1_id: 2, guild2_id: 3, start: DateTime.now - 40.minutes, end: DateTime.now - 5.minutes, prize: 20, max_unanswered: 5, is_accepted: true, guild1_wins: 3, guild2_wins: 2, is_end: true)
Match.create(player1_id: 5, player2_id: 10, guild1_id: 2, guild2_id: 3, is_end: true, war_id: 1, player1_score: 7, player2_score: 2)
Match.create(player1_id: 6, player2_id: 9, guild1_id: 2, guild2_id: 3, is_end: true, war_id: 1, player1_score: 6, player2_score: 7)
Match.create(player1_id: 7, player2_id: 9, guild1_id: 2, guild2_id: 3, is_end: true, war_id: 1, player1_score: 5, player2_score: 7)
Match.create(player1_id: 10, player2_id: 8, guild1_id: 3, guild2_id: 2, is_end: true, war_id: 1, player1_score: 3, player2_score: 7)
Match.create(player1_id: 9, player2_id: 4, guild1_id: 3, guild2_id: 2, is_end: true, war_id: 1, player1_score: 4, player2_score: 7)

War.create(guild1_id: 1, guild2_id: 3, start: DateTime.now + 12.minutes, end: DateTime.now + 30.minutes, prize: 15, max_unanswered: 5, is_accepted: true)
