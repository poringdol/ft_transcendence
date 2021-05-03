class CreateRooms < ActiveRecord::Migration[6.0]
  def change
    create_table :rooms do |t|
      t.string :name
      t.string :password, default: nil
      t.references :owner
      t.timestamps
      t.boolean :is_direct, default: false
    end
  end
end
