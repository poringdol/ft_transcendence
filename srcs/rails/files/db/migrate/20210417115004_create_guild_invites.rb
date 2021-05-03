class CreateGuildInvites < ActiveRecord::Migration[6.0]
  def change
    create_table :guild_invites do |t|
      t.references :inviter, index: true, foreign_key: { to_table: :users }
      t.references :invited, index: true, foreign_key: { to_table: :users }
      t.references :guild
      
      t.timestamps
    end
  end
end
