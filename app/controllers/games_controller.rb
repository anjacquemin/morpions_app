class GamesController < ApplicationController
  def show
    @game = Game.find(params[:id])
    @stimulus_controller = (@game.local ? "local" : "online")
    @display_game_class = "d-none"
    unless session["player-#{@game.name}".to_sym]
      @display_game_class = ""
      session["player-#{@game.name}".to_sym] = "player2"
      @game.update_attribute(:is_ready, true)
      p("before broadcast when other person join")
      GameChannel.broadcast_to(@game, type: "ready_to_play")
    end
    if session["player-#{@game.name}"] == "player2"
      @user = "player2"
    else
      @user = "player1"
    end
  end

  def index
    @games = Game.all
    @not_ready_games = @games.select {|game| !game.is_ready}
    @game = Game.new
  end

  def create
    @game = Game.new(games_params)
    session["player-#{@game.name}".to_sym] = "player1"
    @game.local = ("Local" == params[:game][:local])
    if @game.save!
      @game.update_attribute(:is_ready, true) if @game.local
      @game.update_attribute(:number_of_players, 1)
      redirect_to(@game)
    else
      render "index"
    end
  end

  def update
    @game = Game.find(params[:id])
    data = JSON.parse(params["json"])
    puts("update")
    puts(data["type"])
    if data["type"] == "game_action"
      GameChannel.broadcast_to(@game, type: data["type"], player: data["player"], case_clicked: data["case"])
    else
      GameChannel.broadcast_to(@game, type: data["type"])
    end
  end



  private

    def games_params
      params.require(:game).permit(:name)
    end
end
