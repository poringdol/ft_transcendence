class GuildUserSerializer < ActiveModel::Serializer
  attributes :id, :nickname, :avatar, :is_officer, :is_admin, :is_moderator, :guild, :guild_id
end
