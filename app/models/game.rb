class Game < ApplicationRecord
  # belongs_to :player_1, class_name: "User"
  validates :name, presence: true, length: {maximum: 10}, uniqueness: true
  validates :local, inclusion: { in: [true, false] }
  validates :number_of_players, numericality: { only_integer: true, greater_than_or_equal_to: 0 }
end
