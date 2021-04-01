class Blocklist < ApplicationRecord

  belongs_to :user, class_name: 'User', foreign_key: 'user_id'
  belongs_to :blocked_user, class_name: 'User', foreign_key: 'blocked_user_id'
  
end
