class Tournament < ApplicationRecord
  belongs_to :addons, class_name: 'Addon', foreign_key: 'addons_id', optional: true

  has_many :tournament_matches, dependent: :destroy
  has_many :tournament_users, dependent: :destroy

  after_create {
    self.addons = Addon.create(addon1: false, addon2: false, addon3: false)
    self.save()
  }

  after_destroy {
    addon = Addon.where(id: self.addons_id).first
	  if addon.present?
	  	addon.destroy
	  end
  }
end
