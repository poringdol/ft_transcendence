class CreateFriends < ActiveRecord::Migration[6.0]
  def change
    create_table :friends do |t|
      t.references :user, index: true, foreign_key: { to_table: :users }
      t.references :friend, index: true, foreign_key: { to_table: :users }
	    t.boolean :is_friend, default: false
	  
      t.timestamps
    end
  end
end
