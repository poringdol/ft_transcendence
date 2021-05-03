class GuildInviteSerializer < ActiveModel::Serializer
  attributes :id, :inviter, :invited_id, :guild

  def inviter
	{
		id: self.object.user.id,
		nickname: self.object.user.nickname,
    	avatar: self.object.user.avatar,
	}
  end

#   def invited
# 	{
# 		id: self.object.friend.id,
# 		nickname: self.object.friend.nickname,
#     	avatar: self.object.friend.avatar,
# 	}
#   end

  def guild
	{
		id: self.object.guild.id,
		name: self.object.guild.name,
		anagram: self.object.guild.anagram,
    	logo: self.object.guild.logo,
	}
  end

end
