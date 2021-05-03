class TournamentMatch < ApplicationRecord
  belongs_to :tournament
  belongs_to :match
end
