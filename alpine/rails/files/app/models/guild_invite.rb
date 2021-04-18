class GuildInvite < ApplicationRecord

    belongs_to :user, class_name: 'User', foreign_key: 'inviter_id'
    belongs_to :friend, class_name: 'User', foreign_key: 'invited_id'
	belongs_to :guild, class_name: 'Guild', foreign_key: 'guild_id'
    validates :inviter_id, presence: true
    validates :invited_id, presence: true
    # validates :guild_id, presence: true

end