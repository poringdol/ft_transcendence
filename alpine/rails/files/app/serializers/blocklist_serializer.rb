class BlocklistSerializer < ActiveModel::Serializer
  attributes :id
  has_one :user
  has_one :blocked_user
end
