class MatchUserSerializer < ActiveModel::Serializer
  attributes :id
  # :player1,
  # :player2
  # , :current_user

  # def player1
  #   {
  #     player1_id: self.object.player1.id,
  #     player1_nickname: self.object.player1.player1_nickname,
  #     player1_avatar: self.object.player1.player1_avatar,
  #     player1_guild: self.object.player1.player1_guild,
  #   }
  # end

  # def player2
  #   {
  #     player2_id: self.object.player2.id,
  #     player2_nickname: self.object.player2.player1_nickname,
  #     player2_avatar: self.object.player2.player1_avatar,
  #     player2_guild: self.object.player2.player1_guild
  #   }
  # end

  # def current_user
  #   {
  #     current_user_id: self.object.current_user.id
  #   }
  # end

end
