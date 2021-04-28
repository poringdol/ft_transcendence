class WarMatchSerializer < ActiveModel::Serializer
  attributes :id
  has_one :match
  has_one :war

  def match
    {
      id:		self.object.match.id, 
      player1:	self.object.match.player1,
      player2:	self.object.match.player2,
	  guild_1:	self.object.match.guild_1,
	  guild_2:	self.object.match.guild_2,
	  player1_score: self.object.match.player1_score,
	  player2_score: self.object.match.player2_score,
    }
  end

end
