# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `rails
# db:schema:load`. When creating a new database, `rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2021_04_17_115004) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "addons", force: :cascade do |t|
    t.boolean "addon1"
    t.boolean "addon2"
    t.boolean "addon3"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "blocklists", force: :cascade do |t|
    t.bigint "user_id"
    t.bigint "blocked_user_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["blocked_user_id"], name: "index_blocklists_on_blocked_user_id"
    t.index ["user_id"], name: "index_blocklists_on_user_id"
  end

  create_table "friends", force: :cascade do |t|
    t.bigint "user_id"
    t.bigint "friend_id"
    t.boolean "is_friend", default: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["friend_id"], name: "index_friends_on_friend_id"
    t.index ["user_id"], name: "index_friends_on_user_id"
  end

  create_table "guild_invites", force: :cascade do |t|
    t.bigint "inviter_id"
    t.bigint "invited_id"
    t.bigint "guild_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["guild_id"], name: "index_guild_invites_on_guild_id"
    t.index ["invited_id"], name: "index_guild_invites_on_invited_id"
    t.index ["inviter_id"], name: "index_guild_invites_on_inviter_id"
  end

  create_table "guild_members", force: :cascade do |t|
    t.bigint "user_id"
    t.bigint "guild_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["guild_id"], name: "index_guild_members_on_guild_id"
    t.index ["user_id"], name: "index_guild_members_on_user_id"
  end

  create_table "guild_officers", force: :cascade do |t|
    t.bigint "user_id"
    t.bigint "guild_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["guild_id"], name: "index_guild_officers_on_guild_id"
    t.index ["user_id"], name: "index_guild_officers_on_user_id"
  end

  create_table "guilds", force: :cascade do |t|
    t.string "name"
    t.string "anagram"
    t.string "logo"
    t.integer "score", default: 0
    t.integer "rating", default: 0
    t.bigint "owner_id"
    t.boolean "is_in_war", default: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["owner_id"], name: "index_guilds_on_owner_id"
  end

  create_table "matches", force: :cascade do |t|
    t.bigint "current_user_id"
    t.bigint "player1_id", null: false
    t.bigint "player2_id", null: false
    t.integer "player1_score", default: 0
    t.integer "player2_score", default: 0
    t.bigint "guild_1_id"
    t.bigint "guild_2_id"
    t.bigint "addons_id"
    t.boolean "is_end", default: false
    t.boolean "is_inprogress", default: false
    t.boolean "is_ranked", default: false
    t.boolean "is_player1_online", default: false
    t.boolean "is_player2_online", default: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["addons_id"], name: "index_matches_on_addons_id"
    t.index ["current_user_id"], name: "index_matches_on_current_user_id"
    t.index ["guild_1_id"], name: "index_matches_on_guild_1_id"
    t.index ["guild_2_id"], name: "index_matches_on_guild_2_id"
    t.index ["player1_id"], name: "index_matches_on_player1_id"
    t.index ["player2_id"], name: "index_matches_on_player2_id"
  end

  create_table "messages", force: :cascade do |t|
    t.text "content"
    t.bigint "user_id", null: false
    t.bigint "room_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["room_id"], name: "index_messages_on_room_id"
    t.index ["user_id"], name: "index_messages_on_user_id"
  end

  create_table "room_users", force: :cascade do |t|
    t.bigint "user_id"
    t.bigint "room_id"
    t.boolean "is_admin", default: false
    t.boolean "is_muted", default: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["room_id"], name: "index_room_users_on_room_id"
    t.index ["user_id"], name: "index_room_users_on_user_id"
  end

  create_table "rooms", force: :cascade do |t|
    t.string "name"
    t.string "password"
    t.bigint "owner_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.boolean "is_direct", default: false
    t.index ["owner_id"], name: "index_rooms_on_owner_id"
  end

  create_table "sessions", force: :cascade do |t|
    t.string "session_id", null: false
    t.text "data"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["session_id"], name: "index_sessions_on_session_id", unique: true
    t.index ["updated_at"], name: "index_sessions_on_updated_at"
  end

  create_table "users", force: :cascade do |t|
    t.string "avatar"
    t.string "email", default: "", null: false
    t.string "nickname"
    t.bigint "guild_id", default: nil
    t.string "encrypted_password", default: "", null: false
    t.boolean "is_admin", default: false
    t.boolean "is_moderator", default: false
    t.boolean "is_banned", default: false
    t.boolean "is_officer", default: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer "sign_in_count", default: 0, null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.inet "current_sign_in_ip"
    t.inet "last_sign_in_ip"
    t.string "provider"
    t.string "uid"
    t.boolean "is_online", default: false
    t.integer "loses", default: 0
    t.integer "wins", default: 0
    t.integer "score", default: 0
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "encrypted_otp_secret"
    t.string "encrypted_otp_secret_iv"
    t.string "encrypted_otp_secret_salt"
    t.integer "consumed_timestep"
    t.boolean "otp_required_for_login"
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["guild_id"], name: "index_users_on_guild_id"
    t.index ["provider"], name: "index_users_on_provider"
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
    t.index ["uid"], name: "index_users_on_uid", unique: true
  end

  create_table "war_matches", force: :cascade do |t|
    t.bigint "match_id", null: false
    t.bigint "war_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["match_id"], name: "index_war_matches_on_match_id"
    t.index ["war_id"], name: "index_war_matches_on_war_id"
  end

  create_table "wars", force: :cascade do |t|
    t.bigint "guild_1_id", null: false
    t.bigint "guild_2_id", null: false
    t.datetime "start"
    t.datetime "end"
    t.integer "prize", default: 0
    t.integer "max_unanswered", default: 10
    t.bigint "addons_id"
    t.integer "guild_1_wins", default: 0
    t.integer "guild_2_wins", default: 0
    t.boolean "is_end", default: false
    t.boolean "is_accepted", default: false
    t.boolean "is_ranked", default: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["addons_id"], name: "index_wars_on_addons_id"
    t.index ["guild_1_id"], name: "index_wars_on_guild_1_id"
    t.index ["guild_2_id"], name: "index_wars_on_guild_2_id"
  end

  add_foreign_key "blocklists", "users"
  add_foreign_key "blocklists", "users", column: "blocked_user_id"
  add_foreign_key "friends", "users"
  add_foreign_key "friends", "users", column: "friend_id"
  add_foreign_key "guild_invites", "users", column: "invited_id"
  add_foreign_key "guild_invites", "users", column: "inviter_id"
  add_foreign_key "matches", "addons", column: "addons_id"
  add_foreign_key "matches", "guilds", column: "guild_1_id"
  add_foreign_key "matches", "guilds", column: "guild_2_id"
  add_foreign_key "matches", "users", column: "current_user_id"
  add_foreign_key "matches", "users", column: "player1_id"
  add_foreign_key "matches", "users", column: "player2_id"
  add_foreign_key "messages", "rooms"
  add_foreign_key "messages", "users"
  add_foreign_key "war_matches", "matches"
  add_foreign_key "war_matches", "wars"
  add_foreign_key "wars", "addons", column: "addons_id"
  add_foreign_key "wars", "guilds", column: "guild_1_id"
  add_foreign_key "wars", "guilds", column: "guild_2_id"
end
