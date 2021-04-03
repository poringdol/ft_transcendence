class CreateRoomUsers < ActiveRecord::Migration[6.0]
  def change
    create_table :room_users do |t|
      t.references :user
      t.references :room
      t.timestamps
    end
  end
end
