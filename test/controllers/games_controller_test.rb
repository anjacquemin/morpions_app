require "test_helper"

class GamesControllerTest < ActionDispatch::IntegrationTest
  # test "the truth" do
  #   assert true
  # end
  def setup
    @game = games(:first_game)
  end

  test "should get homepage with root" do
    get root_url
    assert_response :success
  end

  test "should get homepage with full url" do
    get games_path
    assert_response :success
  end

  test "should get game page" do
    get game_path(@game)
    assert_response :success
  end

end
