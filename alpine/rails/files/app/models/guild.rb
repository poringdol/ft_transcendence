class Guild < ApplicationRecord
  validates :name, presence: true, uniqueness: true
  validates :anagram, presence: true, length: { maximum: 5 }, uniqueness: true
  validates :owner_id, presence: true, uniqueness: true

  has_many :guild_members
  has_many :guild_officers
  has_many :members, :through => :guild_members, :source => :user
  has_many :officers, :through => :guild_officers, :source => :user

  after_create {
    user = User.where(id: owner_id)
    user.update(guild_id: id)
    GuildMember.create(user_id: owner_id, guild_id: id)
  }
end