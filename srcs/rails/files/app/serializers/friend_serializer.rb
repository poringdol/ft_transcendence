class FriendSerializer < ActiveModel::Serializer
  attributes :id, :friend

  def friend
    {
      friend_id: self.object.friend.id, 
      nickname: self.object.friend.nickname,
      avatar: self.object.friend.avatar,
	#   is_friend: self.object.is_friend
    }
  end

end


class ErrorSerializer < ActiveModel::Serializer
  attributes :id, :error

  def error
    {
      name: self.object.name, 
      text: self.object.text,
    }
  end

end