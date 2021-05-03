class CreateBlocklists < ActiveRecord::Migration[6.0]
  def change
    create_table :blocklists do |t|
      t.references :user, index: true, foreign_key: { to_table: :users }
      t.references :blocked_user, index: true, foreign_key: { to_table: :users }

      t.timestamps
    end
  end
end
