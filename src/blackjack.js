const STARTING_BANKROLL = 100;
const BOT_STAND_SCORE = 17;
let bankroll = STARTING_BANKROLL;
let bet = 0;
let playerScore = 0;
let botScore = 0;
let roundActive = false;

const bankrollDisplay = document.querySelector("#bankroll");
const betInput = document.querySelector("#bet");
const scoreDisplay = document.querySelector("#score");
const botScoreDisplay = document.querySelector("#bot-score");
const cardDisplay = document.querySelector("#card");
const messageDisplay = document.querySelector("#message");
const startRoundButton = document.querySelector("#start-round");
const hitButton = document.querySelector("#hit");
const standButton = document.querySelector("#stand");
const newGameButton = document.querySelector("#new-game");

function randomCard() {
  return Math.floor(Math.random() * 10) + 1;
}

function updateBankroll() {
  bankrollDisplay.textContent = `Your bankroll: $${bankroll}`;
  betInput.max = String(bankroll);
  startRoundButton.disabled = roundActive || bankroll < 1;
}

function updateScores(revealBot = false) {
  scoreDisplay.textContent = `Your score: ${playerScore}`;
  botScoreDisplay.textContent = revealBot
    ? `Bot score: ${botScore}`
    : "Bot score: hidden";
}

function finishRound() {
  roundActive = false;
  hitButton.disabled = true;
  standButton.disabled = true;

  if (playerScore > 21) {
    bankroll -= bet;
    messageDisplay.textContent = `Bust! The bot wins. You lose $${bet}.`;
  } else if (botScore > 21 || playerScore > botScore) {
    bankroll += bet;
    messageDisplay.textContent = `You win! You gain $${bet}.`;
  } else if (playerScore < botScore) {
    bankroll -= bet;
    messageDisplay.textContent = `The bot wins. You lose $${bet}.`;
  } else {
    messageDisplay.textContent = `It's a tie. Your bet is returned.`;
  }

  updateScores(true);
  updateBankroll();
}

function playBotTurn() {
  while (botScore < BOT_STAND_SCORE) {
    botScore += randomCard();
  }
  finishRound();
}

function startRound() {
  const chosenBet = Number(betInput.value);
  if (!Number.isInteger(chosenBet) || chosenBet < 1 || chosenBet > bankroll) {
    messageDisplay.textContent = `Enter a whole-number bet from $1 to $${bankroll}.`;
    return;
  }

  bet = chosenBet;
  playerScore = randomCard() + randomCard();
  botScore = randomCard() + randomCard();
  roundActive = true;
  hitButton.disabled = false;
  standButton.disabled = false;
  cardDisplay.textContent = "You and the bot were dealt two cards.";
  messageDisplay.textContent = `You bet $${bet}. Hit or stand.`;
  updateScores();
  updateBankroll();

  if (playerScore > 21) {
    playBotTurn();
  }
}

function hit() {
  if (!roundActive) return;

  const card = randomCard();
  playerScore += card;
  cardDisplay.textContent = `You drew a ${card}.`;
  updateScores();

  if (playerScore > 21) {
    playBotTurn();
  }
}

function stand() {
  if (!roundActive) return;
  messageDisplay.textContent = `You stood with ${playerScore}. The bot is playing...`;
  playBotTurn();
}

function startNewGame() {
  bankroll = STARTING_BANKROLL;
  bet = 0;
  playerScore = 0;
  botScore = 0;
  roundActive = false;
  betInput.value = "10";
  cardDisplay.textContent = "No cards dealt yet.";
  messageDisplay.textContent = "Choose a bet and start a round.";
  hitButton.disabled = true;
  standButton.disabled = true;
  updateScores();
  updateBankroll();
}

startRoundButton.addEventListener("click", startRound);
hitButton.addEventListener("click", hit);
standButton.addEventListener("click", stand);
newGameButton.addEventListener("click", startNewGame);

updateBankroll();