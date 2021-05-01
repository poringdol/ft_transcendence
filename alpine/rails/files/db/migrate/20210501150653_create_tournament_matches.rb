class CreateTournamentMatches < ActiveRecord::Migration[6.0]
  def change
    create_table :tournament_matches do |t|
      t.references :tournament, null: false, foreign_key: true
      t.references :match, null: false, foreign_key: true
      t.boolean :is_rating1, default: false
      t.boolean :is_rating2, default: false

      t.timestamps
    end
  end
end
