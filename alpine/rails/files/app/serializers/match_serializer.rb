class MatchSerializer < ActiveModel::Serializer
  attributes :id, :player1_score, :player2_score, :is_end
  has_one :player1
  has_one :player2
  has_one :guild_1
  has_one :guild_2
  has_one :addons
end
