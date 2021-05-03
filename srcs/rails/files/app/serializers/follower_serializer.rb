class FollowerSerializer < ActiveModel::Serializer
  attributes :id, :user

  def user
    {
      user_id: self.object.user.id, 
      nickname: self.object.user.nickname,
      avatar: self.object.user.avatar,
    }
  end

end