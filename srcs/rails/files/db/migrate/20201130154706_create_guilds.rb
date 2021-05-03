class CreateGuilds < ActiveRecord::Migration[6.0]
  def change
    create_table :guilds do |t|
      t.string :name
      t.string :anagram
      t.string :logo
      t.integer :score, default: 0
      t.integer :rating, default: 0
      t.references :owner
      t.references :war, default: nil

      t.timestamps
    end
  end
end
