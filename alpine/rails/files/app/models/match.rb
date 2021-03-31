class Match < ApplicationRecord

  belongs_to :player_1, class_name: 'User', foreign_key: 'player_1_id'
  belongs_to :player_2, class_name: 'User', foreign_key: 'player_2_id'
  belongs_to :guild_1, class_name: 'Guild', foreign_key: 'guild_1_id', optional: true
  belongs_to :guild_2, class_name: 'Guild', foreign_key: 'guild_2_id', optional: true
  belongs_to :addons, class_name: 'Addon', foreign_key: 'addons_id', optional: true

  after_create {
    self.addons = Addon.create()
  }

end
