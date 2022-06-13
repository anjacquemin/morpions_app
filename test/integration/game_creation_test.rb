require "test_helper"

class GameCreationTest < ActionDispatch::IntegrationTest
  # test "the truth" do
  #   assert true
  # end
  test "should redirect to a ready game for local play" do
    get games_path
    post games_path, params: {game: {name: "game1", local: "Local"}}
    game = assigns(:game)
    assert game.valid?
    assert game.is_ready
    follow_redirect!
    assert_template 'games/show'
  end

  test "should not be ready if online game" do
    get games_path
    post games_path, params: {game: {name: "game1", local: "Online"}}
    game = assigns(:game)
    assert game.valid?
    assert_not game.is_ready
    follow_redirect!
    assert_template 'games/show'
  end

  test "invalid name && local" do
    get games_path
    assert_no_difference "Game.count" do
      post games_path, params: {game: {name: "game1game1game1", local: ""}}
    end
    game = assigns(:game)
    assert game.errors.messages.size == 2
    follow_redirect!
    assert_template 'games/index'
    assert_not flash.empty?
  end

  test "invalid name" do
    get games_path
    assert_no_difference "Game.count" do
      post games_path, params: {game: {name: "game1game1game1", local: "Local"}}
    end
    game = assigns(:game)
    assert game.errors.messages.size == 1
    follow_redirect!
    assert_template 'games/index'
    assert_not flash.empty?
  end

  test "invalid local" do
    get games_path
    assert_no_difference "Game.count" do
      post games_path, params: {game: {name: "game1", local: ""}}
    end
    game = assigns(:game)
    assert game.errors.messages.size == 1
    follow_redirect!
    assert_template 'games/index'
    assert_not flash.empty?
  end
end
