class CreateTournamentUsers < ActiveRecord::Migration[6.0]
  def change
    create_table :tournament_users do |t|
      t.references :user, null: false, foreign_key: true
      t.references :tournament, null: false, foreign_key: true
      t.integer :wins, default: 0
      t.integer :loses, default: 0
      t.integer :score, default: 0

      t.timestamps
    end
  end
end
