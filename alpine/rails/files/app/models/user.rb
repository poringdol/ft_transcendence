class User < ApplicationRecord
  
  validates :nickname, presence: true, uniqueness: true

  # belongs_to :guild_id, class_name: 'Guild', foreign_key: 'id', optional: true

  after_create {
    unless guild_id.nil? || guild_id == 0
      GuildMember.create(user_id: id, guild_id: guild_id)
    end
  } # User.create()

  # after_update {} # User.update(), User.save()

  # after_destroy {
  #   if guild_id > 0 && guild_id.owner_id == id

  # } # User.destroy()

  # callback-функции. Будут исполняться после наступления определенного события 
  # after_initialize { код } # User.new()
  # after_save {} # User.save(), User.create()

  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable

  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable, :trackable,
         :omniauthable, :uid, omniauth_providers: [:marvin]

  def self.from_omniauth(auth)
    where(provider: auth.provider, uid: auth.uid).first_or_create do |user|
      user.email = auth.info.email
      user.password = Devise.friendly_token[0,20]
      user.nickname = auth.info.nickname
    end
  end
end
