class TournamentMatchSerializer < ActiveModel::Serializer
  attributes :id
  has_one :tournament
  has_one :match

  def match
    {
      id:		self.object.match.id, 
      player1:	self.object.match.player1,
      player2:	self.object.match.player2,
      guild1:	self.object.match.guild1,
      guild2:	self.object.match.guild2,
      player1_score: self.object.match.player1_score,
      player2_score: self.object.match.player2_score,
      is_end:	self.object.match.is_end,
      is_inprogress: self.object.match.is_inprogress,
      addons:	self.object.match.addons,
    }
  end
  
end
