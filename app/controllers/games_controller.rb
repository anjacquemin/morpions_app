class GamesController < ApplicationController
  def show
    @game = Game.find(params[:id])
    #if player_session not defined, it means that it is the second player who joins (the session of the first player is created when the game is)
    unless (player_session = session["player-#{@game.name}".to_sym])
      player_session = "player2"
      @game.update_attribute(:is_ready, true)
      GameChannel.broadcast_to(@game, type: "ready_to_play")
    end
    #initialize all variable needed for the view for stimulus JS
    @display_game_class = set_if_player2_or_not(player_session, "d", "d-none")
    @display_waiting_class = set_if_player2_or_not(player_session, "d-none", "d")
    @user = set_if_player2_or_not(player_session, "player2", "player1")
    @url = "#{games_url}/"
    @stimulus_controller = set_controller_name(@game)
  end

  def index
    #If we are on the page 1, no params given
    @page = (params[:page] ? params[:page].to_i : 1)
    #Get only 5 games to be displayed on a single page
    @games = Game.where(is_ready: nil).order(created_at: :desc).offset((@page-1) * 5).limit(5)
    @not_ready_games = @games.select {|game| !game.is_ready}
    @game = Game.new
  end

  def create
    @game = Game.new(games_params)
    session["player-#{@game.name}".to_sym] = "player1"
    @game.local = ("Local" == params[:game][:local])
    if @game.save
      #if local game, no need to wait for another player
      @game.update_attribute(:is_ready, true) if @game.local
      @game.update_attribute(:number_of_players, 1)
      redirect_to(@game)
    else
      flash[:notice] = "Name can not be blank..."
      redirect_to games_path
    end
  end

  def update
    @game = Game.find(params[:id])
    data = JSON.parse(params["json"])
    #data can be received from different ways
    if data["type"] == "game_action"
      #either when a player plays
      GameChannel.broadcast_to(@game, type: data["type"], player: data["player"], case_clicked: data["case"])
    else
      #or when he restarts the game or joins the game for the first time
      GameChannel.broadcast_to(@game, type: data["type"])
    end
  end

  private

    def games_params
      params.require(:game).permit(:name)
    end

    def set_controller_name(game)
      game.local ? "local" : "online"
    end

    def set_if_player2_or_not(player_session, arg1, arg2)
      player_session == "player2" ? arg1 : arg2
    end

end
