class CreateAddons < ActiveRecord::Migration[6.0]
  def change
    create_table :addons do |t|
      t.boolean :addon1, default: false
      t.boolean :addon2, default: false
      t.boolean :addon3, default: false

      t.timestamps
    end
  end
end
