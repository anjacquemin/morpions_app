module GamesHelper
  def pagination(page)
    number_of_games = Game.where(is_ready: nil).count
    [page - 1, page, page + 1, page + 2].select { |p| p <= (number_of_games / 5.0).ceil() && p > 0}
  end
end
