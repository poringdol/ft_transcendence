class MatchSerializer < ActiveModel::Serializer
  attributes :id, :player_1_score, :player_2_score, :is_end
  has_one :player_1
  has_one :player_2
  has_one :guild_1
  has_one :guild_2
  has_one :addons
end
