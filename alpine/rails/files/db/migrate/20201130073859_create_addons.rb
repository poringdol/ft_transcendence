class CreateAddons < ActiveRecord::Migration[6.0]
  def change
    create_table :addons do |t|
      t.boolean :addon1
      t.boolean :addon2
      t.boolean :addon3

      t.timestamps
    end
  end
end
