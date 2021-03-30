class FriendSerializer < ActiveModel::Serializer
  attributes :id, :friend

  def friend
    {
      friend_id: self.object.friend.id, 
      nickname: self.object.friend.nickname,
      avatar: self.object.friend.avatar
    }
  end

end
