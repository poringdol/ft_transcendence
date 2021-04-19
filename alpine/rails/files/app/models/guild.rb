class Guild < ApplicationRecord
  validates :name, presence: true, uniqueness: true
  validates :anagram, presence: true, length: { maximum: 5 }, uniqueness: true
  validates :owner_id, presence: true, uniqueness: true

  mount_uploader :logo, GuildAvatarUploader

  # has_many :user, dependent: :nullify #после удаления гильдии у всех пользователей этой гильдии обнуляется guild_id
  belongs_to :owner, class_name: 'User', foreign_key: 'owner_id'

  has_many :guild_members
  has_many :guild_officers
  has_many :members, :through => :guild_members, :source => :user
  has_many :officers, :through => :guild_officers, :source => :user
  
  has_many :guild_1, class_name: 'Match', foreign_key: 'guild_1_id', dependent: :nullify
  has_many :guild_2, class_name: 'Match', foreign_key: 'guild_2_id', dependent: :nullify

  after_create {
    # назначаем владельца гильдии
    user = User.where(id: self.owner_id)
    user.update(guild_id: self.id)

    # добавляем владельца в список мемберов
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
