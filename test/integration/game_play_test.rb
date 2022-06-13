require "test_helper"

class GamePlayTest < ActionDispatch::IntegrationTest
  # test "the truth" do
  #   assert true
  # end

  test "should  be ready when second user joins" do
    get games_path
    post games_path, params: {game: {name: "game1", local: "Online"}}
    game = assigns(:game)
    assert game.valid?
    assert_not game.is_ready
    follow_redirect!
    assert_template 'games/show'
    assert session["player-game1"] == "player1"
    get game_path(game)
    assert_template 'games/show'
    # To be debbuged, find a way to simulate an other browser?
    assert game.reload.is_ready
  end

end
