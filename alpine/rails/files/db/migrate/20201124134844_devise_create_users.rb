# frozen_string_literal: true

class DeviseCreateUsers < ActiveRecord::Migration[6.0]
  def change
    create_table    :users do |t|
      t.string      :avatar
      
      ## Database authenticatable
      t.string      :email,              null: false, default: ""
      t.string      :nickname, unique: true
      t.references  :guild, default: nil, dependent: :nullify
      t.string      :encrypted_password, null: false, default: ""

      t.boolean     :is_admin, default: false
      t.boolean     :is_moderator, default: false
      t.boolean     :is_banned, default: false
      t.boolean     :is_officer, default: false

      ## Recoverable
      t.string      :reset_password_token
      t.datetime    :reset_password_sent_at

      ## Rememberable
      t.datetime    :remember_created_at

      ## Trackable
      t.integer     :sign_in_count, default: 0, null: false
      t.datetime    :current_sign_in_at
      t.datetime    :last_sign_in_at
      t.inet        :current_sign_in_ip
      t.inet        :last_sign_in_ip

      ## Confirmable
      # t.string   :confirmation_token
      # t.datetime :confirmed_at
      # t.datetime :confirmation_sent_at
      # t.string   :unconfirmed_email # Only if using reconfirmable

      ## Lockable
      # t.integer  :failed_attempts, default: 0, null: false # Only if lock strategy is :failed_attempts
      # t.string   :unlock_token # Only if unlock strategy is :email or :both
      # t.datetime :locked_at

      t.string       :provider
      t.string       :uid

      t.boolean      :is_online, default: false
      t.integer      :loses, default: 0
      t.integer      :wins, default: 0
      t.integer      :score, default: 0


      t.timestamps null: false
    end

    add_index :users, :uid, :unique => true
    add_index :users, :provider
    add_index :users, :email,                unique: true
    add_index :users, :reset_password_token, unique: true
    # add_index :users, :confirmation_token,   unique: true
    # add_index :users, :unlock_token,         unique: true
  end
end
