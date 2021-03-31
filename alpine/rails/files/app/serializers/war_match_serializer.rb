class WarMatchSerializer < ActiveModel::Serializer
  attributes :id
  has_one :match
  has_one :war
end
