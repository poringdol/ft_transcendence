class TournamentUserSerializer < ActiveModel::Serializer
  attributes :id, :wins, :loses, :score
  has_one :user
  has_one :tournament
end
