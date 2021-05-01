class TournamentSerializer < ActiveModel::Serializer
  attributes :id, :prize, :start, :end, :is_inprogress, :is_end
end
