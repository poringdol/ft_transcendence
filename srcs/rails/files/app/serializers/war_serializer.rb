class WarSerializer < ActiveModel::Serializer
  attributes :id, :start, :end, :prize, :max_unanswered, :guild1_wins, :guild2_wins, :is_accepted, :is_end, :is_inprogress, :is_ranked
  has_one :guild1
  has_one :guild2
  has_one :addons
end
