// app/javascript/controllers/game_online_controller.js
import { Controller } from "@hotwired/stimulus"
import consumer from "../channels/consumer"
import { eventListeners } from "@popperjs/core"
import { csrfToken } from "@rails/ujs"

export default class extends Controller {

  static values = {gameId: Number}


  static targets = ["results", "winner", "player", "c0","c1","c2","c3","c4","c5","c6","c7","c8"]

  connect() {
    console.log(`id ${this.gameIdValue}`)
    this.channel = consumer.subscriptions.create(
      { channel: "GameChannel", id: this.gameIdValue },
      { received: data => {
          console.log(`received date : ${data["player"]} && ${data["case_clicked"]}`)
          boardDisplay(this, data["player"], data["case_clicked"])
          if(endGameOrNot(this.element)){
            displayResults(this.resultsTarget, this.winnerTarget, data["player"])
            disableClickListenner(this.element)
          }
        }
      }
    )
    console.log(`Subscribe to the chatroom with the id ${this.gameIdValue}.`)
  }

  playerAction(event) {
    const player_to_play = this.playerTarget.dataset.player
    const case_clicked = event.target.dataset.onlineTarget
    let payload = {
      player: player_to_play,
      case: case_clicked
    }
    let data = new FormData();
    data.append ("json", JSON.stringify(payload))

    console.log("send rquest")
    fetch(`http://localhost:3000/games/${this.gameIdValue}`, {
      method: "PATCH",
      headers: { "Accept": "application/json", "X-CSRF-Token": csrfToken() },
      body: data
    })
  }

  boardRefresh() {
    const all_tds = Array.from(this.element.querySelectorAll("td"))
    all_tds.forEach(function(td) {
      td.dataset.type = "none"
      td.dataset.action = "click->online#playerAction"
      td.classList.remove ("cross")
      td.classList.remove ("circle")
      td.classList.add ("not_filled")
    })
    this.resultsTarget.classList.add("d-none")
    this.winnerTarget.innerText = ""
    this.element.dataset.player = "player1"
  }
}


const boardDisplay = (controller, player_to_play, case_clicked) => {
  console.log(case_clicked)
  console.log(player_to_play)
  let class_to_add
  let case_target = case_clicked + "Target"
  console.log(case_target)
  if (player_to_play === "player1") {
    class_to_add = "cross"
    controller.playerTarget.dataset.player = "player2"
    eval(`controller.${case_target}.dataset.type = 'player1'`)
  }
  else{
    class_to_add = "circle"
    controller.playerTarget.dataset.player =  "player1"
    eval(`controller.${case_target}.dataset.type = 'player2'`)
  }
  eval(`controller.${case_target}.dataset.action = ''`)
  eval(`controller.${case_target}.classList.remove("not_filled")`)
  eval(`controller.${case_target}.classList.add(class_to_add)`)
}

const displayResults = (resultsTarget, winnerTarget, player_to_play) => {
  resultsTarget.classList.remove("d-none")
  winnerTarget.innerText = `${player_to_play} win`
}

const disableClickListenner = (element) => {
  const all_tds = Array.from(element.querySelectorAll("td"))
  all_tds.forEach(td => td.dataset.action = "")
}

const endGameOrNot = (element) => {
  const all_tds = Array.from(element.querySelectorAll("td"))
  return check_lines(all_tds) || check_columns(all_tds) || check_diagonales(all_tds)
}

const check_lines = (all_tds) => {
  const first_line = all_tds.slice(0,3)
  const second_line = all_tds.slice(3,6)
  const third_line = all_tds.slice(6,9)
  return check(first_line) || check(second_line) || check(third_line)
}

const check_columns = (all_tds) => {
  const first_column = [all_tds[0], all_tds[3], all_tds[6]]
  const second_column = [all_tds[1], all_tds[4], all_tds[7]]
  const third_column = [all_tds[2], all_tds[5], all_tds[8]]
  return check(first_column) || check(second_column) || check(third_column)
}

const check_diagonales = (all_tds) => {
  const first_diagonale = [all_tds[0], all_tds[4], all_tds[8]]
  const second_diagonale = [all_tds[2], all_tds[4], all_tds[6]]
  return check(first_diagonale) || check(second_diagonale)
}

const check = (tds) => {
  const tds_type = tds.map(x => x.dataset.type)
  if (tds_type.includes("none")) return false;
  return allValuesEqual(tds_type)
}

const allValuesEqual = arr => arr.every(v => v === arr[0])
