class GamesController < ApplicationController
  def show
    @game = Game.find(params[:id])
    @stimulus_controller = (@game.local ? "game" : "online")
    # game.update_attribute(:is_ready, true)
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

  def update
    @game = Game.find(params[:id])
    puts "in the update action"
    puts params["json"].class
    data = JSON.parse(params["json"])
    puts "data : #{data}"
    puts data["player"]
    puts "update methode :"
    puts params["json"]["player"]
    GameChannel.broadcast_to(@game, player: data["player"], case_clicked: data["case"])
  end



  private

    def games_params
      params.require(:game).permit(:name)
    end
end
