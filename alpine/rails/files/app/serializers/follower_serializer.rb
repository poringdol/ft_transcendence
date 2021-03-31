class FollowerSerializer < ActiveModel::Serializer
  attributes :id, :user

  def user
    {
      user_id: self.object.user.id, 
      nickname: self.object.user.nickname,
      avatar: self.object.user.avatar,
	#   is_friend: self.object.is_friend
    }
  end

end