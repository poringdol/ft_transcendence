class CreateGuildMembers < ActiveRecord::Migration[6.0]
  def change
    create_table :guild_members do |t|
      t.belongs_to :user
      t.references :guild
      t.timestamps
    end
  end
end
