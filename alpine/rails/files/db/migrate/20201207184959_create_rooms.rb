class CreateRooms < ActiveRecord::Migration[6.0]
  def change
    create_table :rooms do |t|
      t.string :name
      t.string :password, default: nil
      t.references :login_users, index: true, foreign_key: { to_table: :room_users }, optional: true
      t.references :owner
      t.timestamps
    end
  end
end
