class TournamentSerializer < ActiveModel::Serializer
  attributes :id, :prize, :start, :end, :is_inprogress, :is_end, :name, :members
  has_one :addons
  def members
    {
      count: TournamentUser.where(tournament_id: self.object.id).size
    }
  end
end
