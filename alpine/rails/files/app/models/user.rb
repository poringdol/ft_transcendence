class User < ApplicationRecord
  devise :two_factor_authenticatable,
         :otp_secret_encryption_key => ENV['OTP_KEY']

  validates :nickname, presence: true, uniqueness: true

  # callback-функции. Будут исполняться после наступления определенного события

  after_create {
    unless guild_id.nil? || guild_id == 0
      GuildMember.create(user_id: id, guild_id: guild_id)
    end
  } # User.create()

  # after_update {} # User.update(), User.save()
  # after_destroy {} # User.destroy()
  # after_initialize { код } # User.new()
  # after_save {} # User.save(), User.create()

  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable

  devise :registerable,
         :recoverable, :rememberable, :validatable, :trackable,
         :omniauthable, :uid, omniauth_providers: [:marvin]

  mount_uploader :avatar, AvatarUploader

  # has_many :messages, dependent: :destroy
  # has_many :friends, dependent: :destroy
  # has_many :users, class_name: "Friend", dependent: :destroy

  def otp_qr_code
    issuer = 'PingPongApp'
    label = "#{issuer}:#{email}"
    qrcode = RQRCode::QRCode.new(otp_provisioning_uri(label, issuer: issuer))
    qrcode.as_svg(module_size: 4)
  end

  def self.from_omniauth(auth)
    where(provider: auth.provider, uid: auth.uid).first_or_create do |user|
      user.email = auth.info.email
      user.password = Devise.friendly_token[0,20]
      user.nickname = auth.info.nickname
    end
  end
end
