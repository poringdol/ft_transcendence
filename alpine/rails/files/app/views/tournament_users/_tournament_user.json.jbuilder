json.extract! tournament_user, :id, :user_id, :tournament_id, :created_at, :updated_at
json.url tournament_user_url(tournament_user, format: :json)
