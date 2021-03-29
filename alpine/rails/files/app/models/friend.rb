class Friend < ApplicationRecord
  belongs_to :user_id, class_name: 'User', foreign_key: 'user_id'
  belongs_to :friend_id, class_name: 'User', foreign_key: 'friend_id'
end
