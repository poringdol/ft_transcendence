json.extract! tournament_match, :id, :tournament_id, :match_id, :created_at, :updated_at
json.url tournament_match_url(tournament_match, format: :json)
