class User < ApplicationRecord
  devise :two_factor_authenticatable,
         :otp_secret_encryption_key => ENV['OTP_KEY']

  devise :registerable,
         :recoverable, :rememberable, :validatable, :trackable,
         :omniauthable, :uid, omniauth_providers: [:marvin]

  mount_uploader :avatar, AvatarUploader

  belongs_to :guild, class_name: 'Guild', foreign_key: 'guild_id', optional: true

  validates :nickname, presence: true, uniqueness: true

  after_create {
    unless guild_id.nil? || guild_id == 0
      GuildMember.create(user_id: id, guild_id: guild_id)
    end
  }

  def otp_qr_code
    issuer = 'PingPongApp'
    label = "#{issuer}:#{email}"
    qrcode = RQRCode::QRCode.new(otp_provisioning_uri(label, issuer: issuer))
    qrcode.as_svg(module_size: 4)
  end

  def self.from_omniauth(auth)
    us = User.where(nickname: auth.info.nickname).first
    if us.present?
      if us.last_sign_in_ip != nil
        auth.info.nickname = auth.info.nickname + "#{rand(666)}"
      end
    end
    where(provider: auth.provider, uid: auth.uid).first_or_create do |user|
      user.email = auth.info.email
      user.password = Devise.friendly_token[0,20]
      user.nickname = auth.info.nickname
    end
  end

  def self.online
    ids = ActionCable.server.pubsub.redis_connection_for_subscriptions.smembers "online"
    where(id: ids)
  end
end
