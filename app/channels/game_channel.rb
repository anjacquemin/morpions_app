class GameChannel < ApplicationCable::Channel
  def subscribed
    # stream_from "some_channel"
    puts "subscribed channel"
    puts "params : "
    puts params
    game = Game.find(params[:id])
    stream_for game
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end
end
