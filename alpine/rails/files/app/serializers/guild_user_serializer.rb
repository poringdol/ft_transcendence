class GuildUserSerializer < ActiveModel::Serializer
  attributes :id, :nickname, :avatar, :is_officer, :is_admin, :guild, :guild_id
end
