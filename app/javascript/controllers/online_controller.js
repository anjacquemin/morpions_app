// app/javascript/controllers/game_online_controller.js
import { Controller } from "@hotwired/stimulus"
import consumer from "../channels/consumer"
import { eventListeners } from "@popperjs/core"
import { csrfToken } from "@rails/ujs"
import {endGameOrNot, displayResults, disableClickListenner, tdUpdate} from  "./_game_librairy"

export default class extends Controller {

  static values = {gameId: Number}

  static targets = ["results", "winner", "player", "c0","c1","c2","c3","c4","c5","c6","c7","c8"]

  connect() {
    this.channel = consumer.subscriptions.create(
      { channel: "GameChannel", id: this.gameIdValue },
      { received: data => {
          handleGame(this, data["player"], data["case_clicked"])
        }
      }
    )
  }

  playerAction(event) {
    const data = dataBuilding(this, event)

    fetch(`http://localhost:3000/games/${this.gameIdValue}`, {
      method: "PATCH",
      headers: { "Accept": "application/json", "X-CSRF-Token": csrfToken() },
      body: data
    })
  }

  boardRefresh() {
    const all_tds = Array.from(this.element.querySelectorAll("td"))
    all_tds.forEach(function(td) {
      tdUpdate(td, "online")
    })
    this.resultsTarget.classList.add("d-none")
    this.winnerTarget.innerText = ""
    this.playerTarget.dataset.player = "player1"
  }
}

const handleGame = (context, player, clickedCase) => {
  boardDisplay(context, player, clickedCase)
  if(endGameOrNot(context.element)){
    displayResults(context.resultsTarget, context.winnerTarget, player)
    disableClickListenner(context.element)
  }
}

const boardDisplay = (controller, playerToPlay, clickedCase) => {
  let class_to_add
  let targetCase = clickedCase + "Target"
  if (playerToPlay === "player1") {
    class_to_add = "cross"
    controller.playerTarget.dataset.player = "player2"
    eval(`controller.${targetCase}.dataset.type = 'player1'`)
  }
  else{
    class_to_add = "circle"
    controller.playerTarget.dataset.player =  "player1"
    eval(`controller.${targetCase}.dataset.type = 'player2'`)
  }
  eval(`controller.${targetCase}.dataset.action = ''`)
  eval(`controller.${targetCase}.classList.remove("not_filled")`)
  eval(`controller.${targetCase}.classList.add(class_to_add)`)
}

const dataBuilding = (context, event) => {
  const playerToPlay = context.playerTarget.dataset.player
  const clickedCase = event.target.dataset.onlineTarget
  let payload = {
    player: playerToPlay,
    case: clickedCase
  }

  let data = new FormData();
  data.append ("json", JSON.stringify(payload))

  return data
}
