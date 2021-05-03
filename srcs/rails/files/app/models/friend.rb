class Friend < ApplicationRecord

  belongs_to :user, class_name: 'User', foreign_key: 'user_id'
  belongs_to :friend, class_name: 'User', foreign_key: 'friend_id'
  validates :user_id, presence: true
  validates :friend_id, presence: true

end
