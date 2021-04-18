class CreateMatches < ActiveRecord::Migration[6.0]
  def change
    create_table :matches do |t|
      t.references :current_user, foreign_key: { to_table: :users }
      t.references :player1, null: false, foreign_key: { to_table: :users }
      t.references :player2, null: false, foreign_key: { to_table: :users }, default: nil, optional: true
      t.integer :player1_score, default: 0
      t.integer :player2_score, default: 0
      t.references :guild_1, foreign_key: { to_table: :guilds }, optional: true
      t.references :guild_2, foreign_key: { to_table: :guilds }, optional: true
      t.references :addons, foreign_key: true
      
      t.boolean :is_end, default: false
      t.boolean :is_inprogress, default: false
      t.boolean :is_ranked, default: false

      t.boolean :is_player1_online, default: false
      t.boolean :is_player2_online, default: false

      t.timestamps
    end
  end
end
