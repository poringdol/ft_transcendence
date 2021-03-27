class CreateGuilds < ActiveRecord::Migration[6.0]
  def change
    create_table :guilds do |t|
      t.string :name
      t.string :anagram
      t.string :guild_avatar
      t.integer :score, default: 0
      t.references :owner
      t.boolean :is_in_war, default: false

      t.timestamps
    end
  end
end
