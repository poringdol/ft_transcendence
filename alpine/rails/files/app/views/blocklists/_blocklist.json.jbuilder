json.extract! blocklist, :id, :user_id, :blocked_user_id, :created_at, :updated_at
json.url blocklist_url(blocklist, format: :json)
