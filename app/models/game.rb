class Game < ApplicationRecord
  # belongs_to :player_1, class_name: "User"
  validates :name, presence: true, length: {maximum: 10}
end
