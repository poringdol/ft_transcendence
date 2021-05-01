json.extract! tournament, :id, :prize, :start, :end, :created_at, :updated_at
json.url tournament_url(tournament, format: :json)
