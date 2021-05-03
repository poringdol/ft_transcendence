class GuildOfficer < ApplicationRecord
    belongs_to :user
    has_many :guilds
end
