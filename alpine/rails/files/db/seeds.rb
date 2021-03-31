# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

User.create!(email: 'polinaria@a.a', nickname: 'polinaria', password: 'polinaria', password_confirmation: 'polinaria')
guild = Guild.create!(name: 'Creators', anagram: 'CRT', score: 100, rating: 1, owner_id: User.where(nickname: 'polinaria').first.id)
guild.update_column :logo, 'cat_mem.jpg'
# Пользователю (владельцу гильдии) записывается id гильдии в функции-коллбеке в файле models/guild.rb 

User.create!(email: 'cddoma@a.a', nickname: 'cddoma', avatar: 'dog.jpg', guild_id: guild.id, password: 'cddoma', password_confirmation: 'cddoma')
User.create!(email: 'alldeady@a.a', nickname: 'alldeady', avatar: 'cat.jpg', guild_id: guild.id, password: 'alldeady', password_confirmation: 'alldeady')
User.create!(email: 'markvel@a.a', nickname: 'markvel', guild_id: guild.id, password: 'markvel', password_confirmation: 'markvel')

User.create!(email: 'splinter@a.a', nickname: 'splinter', password: 'splinter', password_confirmation: 'splinter')
guild = Guild.create(name: 'Ninja Turtles', anagram: 'TMNT', score: 80, rating: 3, owner_id: User.where(nickname: 'splinter').first.id)
guild.update_column :logo, 'tmnt.jpg'

User.create!(email: 'leonardo@a.a', nickname: 'leonardo', guild_id: guild.id, password: 'leonardo', password_confirmation: 'leonardo')
User.create!(email: 'donatello@a.a', nickname: 'donatello', guild_id: guild.id, password: 'donatello', password_confirmation: 'donatello')
User.create!(email: 'raphael@a.a', nickname: 'raphael', guild_id: guild.id, password: 'raphael', password_confirmation: 'raphael')
User.create!(email: 'michelangelo@a.a', nickname: 'michelangelo', guild_id: guild.id, password: 'michelangelo', password_confirmation: 'michelangelo')

User.create!(email: 'rick_sanchez@a.a', nickname: 'rick_sanchez', password: 'rick_sanchez', password_confirmation: 'rick_sanchez')
guild = Guild.create(name: 'Rick and Morty', anagram: 'R&M', score: 90, rating: 2, owner_id: User.where(nickname: 'rick_sanchez').first.id)
guild.update_column :logo, 'rick_morty.jpg'

User.create!(email: 'morty_smith@a.a', nickname: 'morty_smith', guild_id: guild.id, password: 'morty_smith', password_confirmation: 'morty_smith')

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

Friend.create(user_id: 1, friend_id: 2)
Friend.create(user_id: 1, friend_id: 3)
Friend.create(user_id: 1, friend_id: 4)
Friend.create(user_id: 1, friend_id: 6)
Friend.create(user_id: 1, friend_id: 7)
Friend.create(user_id: 1, friend_id: 8)
Friend.create(user_id: 1, friend_id: 9)

Friend.create(user_id: 2, friend_id: 1)
Friend.create(user_id: 3, friend_id: 1)
Friend.create(user_id: 4, friend_id: 1)
Friend.create(user_id: 5, friend_id: 1)
Friend.create(user_id: 6, friend_id: 1)

Friend.create(user_id: 2, friend_id: 3)
Friend.create(user_id: 2, friend_id: 5)
Friend.create(user_id: 2, friend_id: 6)
Friend.create(user_id: 2, friend_id: 7)
Friend.create(user_id: 2, friend_id: 8)
Friend.create(user_id: 2, friend_id: 9)

Friend.create(user_id: 3, friend_id: 10)
Friend.create(user_id: 3, friend_id: 11)
