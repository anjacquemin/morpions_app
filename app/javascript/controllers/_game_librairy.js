const displayResults = (resultsTarget, winnerTarget, endGameSentence) => {
  resultsTarget.classList.remove("d-none")
  winnerTarget.innerText = endGameSentence
}

const disableClickListenner = (element) => {
  const allTds = Array.from(element.querySelectorAll("td"))
  allTds.forEach(td => td.dataset.action = "")
}

const thereIsAWinner = (element) => {
  const allTds = Array.from(element.querySelectorAll("td"))
  return checkLines(allTds) || checkColums(allTds) || checkDiagonales(allTds)
}

const endGame = (element) => {
  const allTds = Array.from(element.querySelectorAll("td"))
  const tdsType = allTds.map(x => x.dataset.type)
  if(!tdsType.includes("none")) return true
}

const checkLines = (allTds) => {
  const first_line = allTds.slice(0,3)
  const second_line = allTds.slice(3,6)
  const third_line = allTds.slice(6,9)
  return check(first_line) || check(second_line) || check(third_line)
}

const checkColums = (allTds) => {
  const first_column = [allTds[0], allTds[3], allTds[6]]
  const second_column = [allTds[1], allTds[4], allTds[7]]
  const third_column = [allTds[2], allTds[5], allTds[8]]
  return check(first_column) || check(second_column) || check(third_column)
}

const checkDiagonales = (allTds) => {
  const first_diagonale = [allTds[0], allTds[4], allTds[8]]
  const second_diagonale = [allTds[2], allTds[4], allTds[6]]
  return check(first_diagonale) || check(second_diagonale)
}

const check = (tds) => {
  const tdsType = tds.map(x => x.dataset.type)
  if (tdsType.includes("none")) return false;
  return allValuesEqual(tdsType)
}

const allValuesEqual = arr => arr.every(v => v === arr[0])


const tdUpdate = (td, controller_name) => {
  td.dataset.type = "none"
  td.dataset.action = `click->${controller_name}#playerAction`
  td.classList.remove ("cross")
  td.classList.remove ("circle")
  td.classList.add ("not_filled")
}

export { displayResults, disableClickListenner, thereIsAWinner, tdUpdate, endGame }
