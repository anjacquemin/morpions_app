// app/javascript/controllers/game_controller.js
import { Controller } from "@hotwired/stimulus"
import consumer from "../channels/consumer"
import { eventListeners } from "@popperjs/core"
import { csrfToken } from "@rails/ujs"
import {endGameOrNot, displayResults, disableClickListenner, tdUpdate, endGame} from  "./_game_librairy"

export default class extends Controller {

  static values = {gameId: Number}

  static targets = ["results", "winner"]

  playerAction(event) {
    const player_to_play = this.element.dataset.player
    boardDisplay(event, this, player_to_play)
    if(thereIsAWinner(this.element)){
      let endGameSentence = `${player} wins`
      displayResults(this.resultsTarget, this.winnerTarget, endGameSentence)
      disableClickListenner(this.element)
    } else if (endGame(context.element)){
      let endGameSentence = `Nobody wins`
      displayResults(this.resultsTarget, this.winnerTarget, endGameSentence)
      disableClickListenner(this.element)
    }
  }

  boardRefresh() {
    const all_tds = Array.from(this.element.querySelectorAll("td"))
    all_tds.forEach(function(td) {
      tdUpdate(td, "local")
    })
    this.resultsTarget.classList.add("d-none")
    this.winnerTarget.innerText = ""
    this.element.dataset.player = "player1"
  }
}


const boardDisplay = (event, tbody, player_to_play) => {
  let class_to_add
  if (player_to_play === "player1") {
    class_to_add = "cross"
    tbody.element.dataset.player = "player2"
    event.target.dataset.type = "player1"
  }
  else{
    class_to_add = "circle"
    tbody.element.dataset.player = "player1"
    event.target.dataset.type = "player2"
  }
  event.target.dataset.action = ""
  event.target.classList.remove("not_filled")
  event.target.classList.add(class_to_add)
}
