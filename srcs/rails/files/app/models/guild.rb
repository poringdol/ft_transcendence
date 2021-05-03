class Guild < ApplicationRecord
  validates :name, presence: true, uniqueness: true
  validates :anagram, presence: true, length: { maximum: 5 }, uniqueness: true
  validates :owner_id, presence: true, uniqueness: true

  mount_uploader :logo, GuildAvatarUploader

  belongs_to :owner, class_name: 'User', foreign_key: 'owner_id'
  belongs_to :war, class_name: 'War', foreign_key: 'war_id', optional: true

  has_many :guild_members
  has_many :guild_officers
  has_many :members, :through => :guild_members, :source => :user
  has_many :officers, :through => :guild_officers, :source => :user

  has_many :guild1, class_name: 'Match', foreign_key: 'guild1_id', dependent: :nullify
  has_many :guild2, class_name: 'Match', foreign_key: 'guild2_id', dependent: :nullify

  after_create {
    user = User.where(id: self.owner_id)
    user.update(guild_id: self.id)

    GuildMember.create(user_id: owner_id, guild_id: id)
  }

  after_save {
    guilds = Guild.order(:score).reverse
    guilds.each do |g|
      g.update_columns(rating: (guilds.index(g) + 1))
    end
  }

  after_destroy {
    guilds = Guild.order(:score).reverse
    guilds.each do |g|
      g.update_columns(rating: (guilds.index(g) + 1))
    end
  }

  before_destroy {
    users = User.where(guild_id: self.id)
    users.each do |u|
      u.is_officer = false
      u.guild_id = nil
      u.save
    end
  }
end
