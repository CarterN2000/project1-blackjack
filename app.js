

// PSEUDOCODE FOR PROJECT HERE


/*----- constants -----*/

const SUITS = ["♠", "♣", "♥", "♦"]
const VALUES = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']

const dealerSection = document.querySelector('#dealer-cards')
const playerSection = document.querySelector('#player-cards')

const deposit = document.getElementById('deposit')
const submitter = document.getElementById('submitter')
const newBalance = document.getElementById('balance')


class Deck {
    constructor(cards) {
        this.cards = cards
    }
    shuffleCards(){
        for (let i = this.cards.length; i > 0; i--) {
            let newIndex = math.Floor(Math.random() * i)
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


/*----- cached elements  -----*/

// I will store all the button elements here
// All varibles in charge of getting user inputs are here

/*----- event listeners -----*/

//  Listen for player choices and respond accoringly
// This could include bet amount, hit/stand/doubledown, or quit game

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


/*----- functions -----*/

// function in charge or making a deck of cards and shuffling them
function makeDeck(){
    return SUITS.flatMap(function(suit){
        return VALUES.map(function(value){
            return new Card(suit, value)
        })
    })
}

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

    dealerSection.appendChild(newCard)
}

// function in charge of initializing/starting the game
// function in charge of getting a player balance, and keeping track of balance throughout game

// function in charge of asking for bet size
// function in charge of assessing each cards numerical value
// function in charge of assessing the player/dealer hand value, records busts and blackjacks too
// function in charge of responding to a "hit"
// function in charge of responding to "double down"
// function in charge of hiding dealer's card, as well as playing out the rest of his hand
// function in charge of determining winner
// function to quit/reset
// There will probably be more... AGGGHHHH




// let testCard = new Card (SUITS[0], VALUES[3])
// renderCard(testCard)

// console.log(testCard)