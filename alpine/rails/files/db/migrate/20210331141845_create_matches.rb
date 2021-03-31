class CreateMatches < ActiveRecord::Migration[6.0]
  def change
    create_table :matches do |t|
      t.references :player_1, null: false, foreign_key: { to_table: :users }
      t.references :player_2, null: false, foreign_key: { to_table: :users }
      t.integer :player_1_score, default: 0
      t.integer :player_2_score, default: 0
      t.references :guild_1, foreign_key: { to_table: :guilds }
      t.references :guild_2, foreign_key: { to_table: :guilds }
      t.references :addons, foreign_key: true
      t.boolean :is_end, default: false

      t.timestamps
    end
  end
end
