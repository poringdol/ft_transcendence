class Match < ApplicationRecord
  belongs_to :current_user, class_name: 'User', foreign_key: 'current_user_id', optional: true
  belongs_to :player1, class_name: 'User', foreign_key: 'player1_id'
  belongs_to :player2, class_name: 'User', foreign_key: 'player2_id', optional: true
  belongs_to :guild1, class_name: 'Guild', foreign_key: 'guild1_id', optional: true
  belongs_to :guild2, class_name: 'Guild', foreign_key: 'guild2_id', optional: true
  belongs_to :addons, class_name: 'Addon', foreign_key: 'addons_id', optional: true
  belongs_to :war, class_name: 'War', foreign_key: 'war_id', optional: true

  has_many :tournament_matches, dependent: :destroy

  after_create {
    if self.addons.nil?
      self.addons = Addon.create()
    end

    self.guild1 = self.player1.guild
    unless self.player2.nil?
      self.guild2 = self.player2.guild
    end
    self.save()
  }
end
