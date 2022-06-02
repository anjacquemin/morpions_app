class GamesController < ApplicationController
  def show
    game = Game.find(params[:id])
    game.update_attribute(:is_ready, true)
  end

  def index
    @games = Game.all
    @not_ready_games = @games.select {|game| !game.is_ready}
    @game = Game.new
  end

  def create
    @game = Game.new(games_params)
    @game.local = ("Local" == params[:game][:local])
    if @game.save!
      # handle game redirection to show if local
      redirect_to games_path
    else
      render "index"
    end
  end

  private

    def games_params
      params.require(:game).permit(:name)
    end
end
