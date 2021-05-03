class CreateWars < ActiveRecord::Migration[6.0]
  def change
    create_table :wars do |t|
      t.references :guild1, null: false, index: true, foreign_key: { to_table: :guilds }
      t.references :guild2, null: false, index: true, foreign_key: { to_table: :guilds }
      t.datetime :start
      t.datetime :end
      t.integer :prize, default: 0
      t.integer :unanswered1, default: 0
      t.integer :unanswered2, default: 0
      t.integer :max_unanswered, default: 10
      t.references :addons, foreign_key: true
      t.integer :guild1_wins, default: 0
      t.integer :guild2_wins, default: 0
      t.boolean :is_inprogress, default: false
      t.boolean :is_end, default: false
      t.boolean :is_accepted, default: false
      t.boolean :is_ranked, default: false

      t.timestamps
    end
  end
end
