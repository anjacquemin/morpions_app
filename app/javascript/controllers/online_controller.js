// app/javascript/controllers/game_online_controller.js
import { Controller } from "@hotwired/stimulus"
import consumer from "../channels/consumer"
import { eventListeners } from "@popperjs/core"
import { csrfToken } from "@rails/ujs"
import {endGameOrNot, displayResults, disableClickListenner, tdUpdate} from  "./_game_librairy"

export default class extends Controller {

  static values = {gameId: Number}

  static targets = ["results", "winner", "player", "c0","c1","c2","c3","c4","c5","c6","c7","c8", "display", "waiting"]

  connect() {
    this.channel = consumer.subscriptions.create(
      { channel: "GameChannel", id: this.gameIdValue },
      { received: data => {
          handleData(data, this)
        }
      }
    )
  }

  refresh(){
    let payload = {
      type: "replay"
    }
    let data = new FormData();
    data.append ("json", JSON.stringify(payload))
    fetch(`http://localhost:3000/games/${this.gameIdValue}`, {
      method: "PATCH",
      headers: { "Accept": "application/json", "X-CSRF-Token": csrfToken() },
      body: data
    })
  }

  playerAction(event) {
    const playerToPlay = this.playerTarget.dataset.player
    const user = this.playerTarget.dataset.user

    if (user === playerToPlay) {
      const data = dataBuilding(event, playerToPlay)

      fetch(`http://localhost:3000/games/${this.gameIdValue}`, {
        method: "PATCH",
        headers: { "Accept": "application/json", "X-CSRF-Token": csrfToken() },
        body: data
      })
    }
  }
}

const handleGame = (context, player, clickedCase) => {
  boardDisplay(context, player, clickedCase)
  if(endGameOrNot(context.element)){
    displayResults(context.resultsTarget, context.winnerTarget, player)
    disableClickListenner(context.element)
  }
}

const handleData = (data, context) => {
  if (data["type"] === "game_action") {
    handleGame(context, data["player"], data["case_clicked"])
  } else if (data["type"] === "ready_to_play") {
    context.displayTarget.classList.remove("d-none")
    context.waitingTarget.classList.add("d-none")
  } else if (data["type"] === "replay") {
    boardRefresh(context)
  }
}

const boardRefresh = (context) => {
  const all_tds = Array.from(context.element.querySelectorAll("td"))
  all_tds.forEach(function(td) {
    tdUpdate(td, "online")
  })
  context.resultsTarget.classList.add("d-none")
  context.winnerTarget.innerText = ""
  context.playerTarget.dataset.player = "player1"
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

const dataBuilding = (event, playerToPlay) => {
  const clickedCase = event.target.dataset.onlineTarget
  let payload = {
    type: "game_action",
    player: playerToPlay,
    case: clickedCase
  }

  let data = new FormData();
  data.append ("json", JSON.stringify(payload))

  return data
}
