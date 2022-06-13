class Game < ApplicationRecord
  # belongs_to :player_1, class_name: "User"
  validates :name, presence: true, length: {maximum: 10}, uniqueness: true
  validates :local, inclusion: { in: [true, false] }
end
