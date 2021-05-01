class TournamentMatchSerializer < ActiveModel::Serializer
  attributes :id, :is_rating1, :is_rating2
  has_one :tournament
  has_one :match
end
