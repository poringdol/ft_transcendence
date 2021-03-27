# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

user =  User.create!(email: 'polinaria@a.a', nickname: 'polinaria', password: 'polinaria', password_confirmation: 'polinaria')
user.update_column :avatar, 'girl.jpg'
guild = Guild.create(name: 'Creators', anagram: 'CRT', owner_id: user.id)
# Пользователю (владельцу гильдии) записывается id гильдии в функции-коллбеке в файле models/guild.rb 

user = User.create!(email: 'cddoma@a.a', nickname: 'cddoma', avatar: 'dog.jpg', guild_id: guild.id, password: 'cddoma', password_confirmation: 'cddoma')
user.update_column :avatar, 'dog.jpg'
user = User.create!(email: 'alldeady@a.a', nickname: 'alldeady', avatar: 'cat.jpg', guild_id: guild.id, password: 'alldeady', password_confirmation: 'alldeady')
user.update_column :avatar, 'cat.jpg'
User.create!(email: 'markvel@a.a', nickname: 'markvel', guild_id: guild.id, password: 'markvel', password_confirmation: 'markvel')

user =  User.create!(email: 'splinter@a.a', nickname: 'splinter', password: 'splinter', password_confirmation: 'splinter')
guild = Guild.create(name: 'Ninja Turtles', anagram: 'TMNT', owner_id: user.id)

User.create!(email: 'leonardo@a.a', nickname: 'leonardo', guild_id: guild.id, password: 'leonardo', password_confirmation: 'leonardo')
User.create!(email: 'donatello@a.a', nickname: 'donatello', guild_id: guild.id, password: 'donatello', password_confirmation: 'donatello')
User.create!(email: 'raphael@a.a', nickname: 'raphael', guild_id: guild.id, password: 'raphael', password_confirmation: 'raphael')
User.create!(email: 'michelangelo@a.a', nickname: 'michelangelo', guild_id: guild.id, password: 'michelangelo', password_confirmation: 'michelangelo')

user =  User.create!(email: 'rick_sanchez@a.a', nickname: 'rick_sanchez', password: 'rick_sanchez', password_confirmation: 'rick_sanchez')
guild = Guild.create(name: 'Rick and Morty', anagram: 'R&M', owner_id: user.id)

User.create!(email: 'morty_smith@a.a', nickname: 'morty_smith', guild_id: guild.id, password: 'morty_smith', password_confirmation: 'morty_smith')
