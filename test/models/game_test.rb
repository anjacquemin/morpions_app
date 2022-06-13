require "test_helper"

class GameTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
  def setup
    @game = Game.new(name: "Ex game", local: "true", number_of_players: 1)
  end

  test "should be valid" do
    assert @game.valid?
  end

  test "name should be present" do
    @game.name = "   "
    assert_not @game.valid?
  end

  test "name should be less than or equal to 10 character" do
    @game.name = "a" * 11
    assert_not @game.valid?
  end

  test "local should be true or false" do
    @game.local = nil
    assert_not @game.valid?
  end

  test "number of players should be greater than or equal to 0" do
    @game.number_of_players = -1
    assert_not @game.valid?
  end

end
