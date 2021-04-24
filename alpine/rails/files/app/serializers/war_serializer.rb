class WarSerializer < ActiveModel::Serializer
  attributes :id, :start, :end, :prize, :max_unanswered, :guild_1_wins, :guild_2_wins, :is_accepted
  has_one :guild_1
  has_one :guild_2
  has_one :addons
end
