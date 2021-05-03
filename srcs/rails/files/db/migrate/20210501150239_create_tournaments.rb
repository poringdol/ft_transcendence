class CreateTournaments < ActiveRecord::Migration[6.0]
  def change
    create_table :tournaments do |t|
	    t.string :name
      t.integer :prize, default: 0
      t.datetime :start
      t.datetime :end
      t.boolean :is_inprogress, default: false
      t.boolean :is_end, default: false
	    t.references :addons, foreign_key: true

      t.timestamps
    end
  end
end
