class MatchSerializer < ActiveModel::Serializer
  attributes :id, :player1_score, :player2_score,
             :is_end, :is_inprogress, :is_ranked,
             :is_player1_online, :is_player2_online, :rating
  has_one :current_user
  has_one :player1
  has_one :player2, optional: true
  has_one :guild1, optional: true
  has_one :guild2, optional: true
  has_one :addons
end
