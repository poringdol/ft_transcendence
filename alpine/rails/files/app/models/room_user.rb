class RoomUser < ApplicationRecord
  belongs_to :user, class_name: 'User', foreign_key: 'user_id'
  belongs_to :room, class_name: 'Room', foreign_key: 'room_id'
end
