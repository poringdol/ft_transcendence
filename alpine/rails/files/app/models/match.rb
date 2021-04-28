class Match < ApplicationRecord

  belongs_to :current_user, class_name: 'User', foreign_key: 'current_user_id', optional: true
  belongs_to :player1, class_name: 'User', foreign_key: 'player1_id'
  belongs_to :player2, class_name: 'User', foreign_key: 'player2_id', optional: true
  belongs_to :guild_1, class_name: 'Guild', foreign_key: 'guild_1_id', optional: true
  belongs_to :guild_2, class_name: 'Guild', foreign_key: 'guild_2_id', optional: true
  belongs_to :addons, class_name: 'Addon', foreign_key: 'addons_id', optional: true

  after_create {
    self.addons = Addon.create()
    self.guild_1 = self.player1.guild
    unless (self.player2.nil?)
      self.guild_2 = self.player2.guild
    end
    self.save()
  }

  def delay_end
    self.update(is_end: true)
    p "11111111111111111111111111111111111111"
    p "11111111111111111111111111111111111111"
    p "11111111111111111111111111111111111111"
    p "11111111111111111111111111111111111111"
    p "11111111111111111111111111111111111111"
    p "11111111111111111111111111111111111111"
    p "11111111111111111111111111111111111111"
    p "11111111111111111111111111111111111111"
    p "11111111111111111111111111111111111111"
    p "11111111111111111111111111111111111111"
    p "11111111111111111111111111111111111111"

    # ActionCable.server.broadcast "match_channel_#{self.id}", { match_id: self.id,
    #                                                            player: -1,
    #                                                            key_code: "end_game"}
  end

end
