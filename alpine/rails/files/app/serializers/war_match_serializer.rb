class WarMatchSerializer < ActiveModel::Serializer
  attributes :id
  has_one :match
  has_one :war

  def match
    {
      id:		self.object.match.id, 
      player1:	self.object.match.player1,
      player2:	self.object.match.player2,
      guild1:	self.object.match.guild1,
      guild2:	self.object.match.guild2,
      player1_score: self.object.match.player1_score,
      player2_score: self.object.match.player2_score,
    }
  end

end
