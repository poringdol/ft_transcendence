class CreateMatches < ActiveRecord::Migration[6.0]
  def change
    create_table :matches do |t|
      t.references :current_user, foreign_key: { to_table: :users }
      t.references :player1, null: false, foreign_key: { to_table: :users }
      t.references :player2, foreign_key: { to_table: :users }, default: nil
      t.integer :player1_score, default: 0
      t.integer :player2_score, default: 0
      t.references :guild1, foreign_key: { to_table: :guilds }, default: nil
      t.references :guild2, foreign_key: { to_table: :guilds }, default: nil
      t.references :addons, foreign_key: true

      t.boolean :is_end, default: false
      t.boolean :is_inprogress, default: false
      t.boolean :is_ranked, default: false
      t.integer :rating, default: 0

      t.boolean :is_player1_online, default: false
      t.boolean :is_player2_online, default: false

      t.references :war, default: nil

      t.timestamps
    end
  end
end
