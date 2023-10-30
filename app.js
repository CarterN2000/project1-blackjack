

// PSEUDOCODE FOR PROJECT HERE


/*----- constants -----*/

const SUITS = ["♠", "♣", "♥", "♦"]
const VALUES = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']

const dealerSection = document.querySelector('#dealer-cards')
const playerSection = document.querySelector('#player-cards')

const deposit = document.getElementById('deposit')
const submitter = document.getElementById('submitter')
const newBalance = document.getElementById('balance')

const betSize = document.getElementById('bet-size')
const placeTheBet = document.getElementById('place-bet')

class Deck {
    constructor(cards) {
        this.cards = cards
    }
    shuffleCards(){
        for (let i = this.cards.length - 1; i > 0; i--) {
            let newIndex = Math.floor(Math.random() * (i + 1))
            let oldValue = this.cards[newIndex]
            this.cards[newIndex] = this.cards[i]
            this.cards[i] = oldValue
        }
    }
}

class Card {
    constructor(suit, value) {
        this.suit = suit
        this.value = value
    }
}
/*----- state variables -----*/

// Here I will need to declare a lot of variables, including all the varaibles for my stats section (wins, loses, balance, hand value)
// I will need a timer that will autopick if the player does not make a valid choice in time
// I will keep booleans here (wonHand, affordBet, showDealerCard, isBust, isBlackJack, etc)
let balance = 0
let betAmount;
let canGoBroke = false


/*----- cached elements  -----*/

// I will store all the button elements here
// All varibles in charge of getting user inputs are here

/*----- event listeners -----*/

// this event listener updates the player's balance when money is deposited
submitter.addEventListener('click', function(){
    let balanceUpdater = deposit.value
    if(!isNaN(deposit.value)) {
        let balanceInt = parseInt(balanceUpdater)
        if(balanceInt < 5000) {
            balance += balanceInt
        }
    }
    deposit.value = ''
    newBalance.innerText = `${balance}`
})


/*----- MAIN GAMEPLAY -> MAIN FUNCTION THAT PUTS TOGETHER ALL SUB-FUNCTIONS AND RUNS THE ENTIRE GAME -----*/

function playBlackJack() {

}




















/*----- functions -----*/

// function in charge or making a deck of cards and shuffling them
function makeDeck(){
    return SUITS.flatMap(function(suit){
        return VALUES.map(function(value){
            return new Card(suit, value)
        })
    })
}
// This is the function used to render a card from the deck onto the screen
function renderCard(card) {
    const newCard = document.createElement('div')
    newCard.innerText = `${card.value}${card.suit}`
    newCard.classList.add('cards')
    if (card.suit === "♠" || card.suit === "♣"){
        newCard.style.color = 'black'
    }
    else {
        newCard.style.color = 'red'
    }
    return(newCard)
}

// function in charge of initializing/starting the game

function startHand() {
    deckCreator = makeDeck()
    currentDeck = new Deck(deckCreator)

    currentDeck.shuffleCards()

    const playerCardOne = currentDeck.cards.pop()
    const dealerCardOne = currentDeck.cards.pop()
    const playerCardTwo = currentDeck.cards.pop()
    const dealerCardTwo = currentDeck.cards.pop()

    playerSection.appendChild(renderCard(playerCardOne))
    dealerSection.appendChild(renderCard(dealerCardOne))
    playerSection.appendChild(renderCard(playerCardTwo))
    dealerSection.appendChild(renderCard(dealerCardTwo)) //THIS CARD NEEDS TO BE HIDDEN

    return currentDeck
}

// function in charge of placing bet

function placeBet() {
    placeTheBet.addEventListener('click', function(){
        if(betSize.value > balance) {
            betSize.value = ''
            return
        }
        else {
            betAmount = betSize.value
            balance -= betAmount
            newBalance.innerText = `${balance}`
        }
        betSize.value = ''
        return betAmount, balance
    })
}
// function in charge of assessing each cards numerical value
// function in charge of assessing the player/dealer hand value, records busts and blackjacks too
// function in charge of responding to a "hit"
// function in charge of responding to "double down"
// function in charge of hiding dealer's card, as well as playing out the rest of his hand
// function in charge of determining winner
// function to quit/reset
// There will probably be more... AGGGHHHH


startHand()
placeBet()