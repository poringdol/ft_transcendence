class War < ApplicationRecord
  belongs_to :guild_1, class_name: 'Guild', foreign_key: 'guild_1_id'
  belongs_to :guild_2, class_name: 'Guild', foreign_key: 'guild_2_id'
  
  belongs_to :addons, class_name: 'Addon', foreign_key: 'addons_id', optional: true

  after_create {
    self.addons = Addon.create(addon1: false, addon2: false, addon3: false)
  }

  after_destroy {
    Addon.find(self.addons_id).destroy
  }
end
