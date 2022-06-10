module GamesHelper
  def pagination(page)
    number_of_games = Game.count
    if page < 2
      page_numbers_to_display = [1,2,3]
    else
      page_numbers_to_display = [page - 1, page, page + 1]
    end
    page_numbers_to_display.select { |p| p <= (number_of_games / 5) + 1 }
  end
end
