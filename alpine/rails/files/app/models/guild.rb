class Guild < ApplicationRecord
  validates :name, presence: true, uniqueness: true
  validates :anagram, presence: true, length: { maximum: 5 }, uniqueness: true
  validates :owner_id, presence: true, uniqueness: true

  mount_uploader :logo, GuildAvatarUploader

  has_many :user, dependent: :nullify #после удаления гильдии у всех пользователей этой гильдии обнуляется guild_id
  # belongs_to :owner_id, class_name: 'User', foreign_key: 'owner_id'

  has_many :guild_members
  has_many :guild_officers
  has_many :members, :through => :guild_members, :source => :user
  has_many :officers, :through => :guild_officers, :source => :user

  after_create {
    user = User.where(id: owner_id)
    user.update(guild_id: id)
    GuildMember.create(user_id: owner_id, guild_id: id)
  }

  after_save {
    guilds = Guild.order(:score).reverse
    guilds.each do |g|
      g.update_columns(rating: (guilds.index(g) + 1))
    end
  }
end