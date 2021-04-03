class GuildUserSerializer < ActiveModel::Serializer
  attributes :id, :nickname, :avatar, :is_officer, :guild
end
