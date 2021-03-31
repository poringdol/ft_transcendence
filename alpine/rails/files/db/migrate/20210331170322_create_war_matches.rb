class CreateWarMatches < ActiveRecord::Migration[6.0]
  def change
    create_table :war_matches do |t|
      t.references :match, null: false, foreign_key: true
      t.references :war, null: false, foreign_key: true

      t.timestamps
    end
  end
end
