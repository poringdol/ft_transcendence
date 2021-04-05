class BlocklistDetailedSerializer < ActiveModel::Serializer
  
  attributes :user_id, :blocked_user

  def blocked_user
    {
      blocked_user_id: self.object.blocked_user.id, 
      blocked_nickname: self.object.blocked_user.nickname,
      blocked_avatar: self.object.blocked_user.avatar,
    }
  end

end
