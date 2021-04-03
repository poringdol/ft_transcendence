class Room < ApplicationRecord
  has_many :messages, dependent: :destroy
  has_many :users, through: :messages
  belongs_to :owner, class_name: 'User', foreign_key: 'owner_id'

end
