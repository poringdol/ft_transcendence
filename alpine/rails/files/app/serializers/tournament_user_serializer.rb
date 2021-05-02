class TournamentUserSerializer < ActiveModel::Serializer
  attributes :id, :wins, :loses, :score
  has_one :user
  has_one :tournament
  has_one :guild

  def guild
    {
	  id: self.object.user.guild ? self.object.user.guild.id : 0,
      name: self.object.user.guild ? self.object.user.guild.anagram : 'none',
	  logo: self.object.user.guild ? self.object.user.guild.logo : 'none',
    }
  end
end
