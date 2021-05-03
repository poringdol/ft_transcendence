class CreateRoomUsers < ActiveRecord::Migration[6.0]
  def change
    create_table :room_users do |t|
      t.references :user
      t.references :room
      t.boolean :is_admin, default: false
      t.boolean :is_muted, default: false
      t.timestamps
    end
  end
end
