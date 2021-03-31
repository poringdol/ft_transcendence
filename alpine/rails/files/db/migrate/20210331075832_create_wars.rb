class CreateWars < ActiveRecord::Migration[6.0]
  def change
    create_table :wars do |t|
      t.references :guild_1, null: false, index: true, foreign_key: { to_table: :guilds }
      t.references :guild_2, null: false, index: true, foreign_key: { to_table: :guilds }
      t.datetime :start
      t.datetime :end
      t.integer :prize, default: 0
      t.integer :max_unanswered, default: 10
      t.references :addons, foreign_key: true
      t.integer :guild_1_wins, default: 0
      t.integer :guild_2_wins, default: 0
      t.boolean :is_end, default: false

      t.timestamps
    end
  end
end
