class CreateGuilds < ActiveRecord::Migration[6.0]
  def change
    create_table :guilds do |t|
      t.string :name, null: false
      t.string :anagram, null: false
      t.integer :score, default: 0
      t.references :owner
      t.boolean :is_in_war, default: false

      t.timestamps
    end
  end
end
