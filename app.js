

// PSEUDOCODE FOR PROJECT HERE


/*----- constants -----*/

const SUITS = ["♠", "♣", "♥", "♦"]
const VALUES = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']

const dealerSection = document.querySelector('#dealer-cards')
const playerSection = document.querySelector('#player-cards')

const deposit = document.getElementById('deposit')
const submitter = document.getElementById('submitter')
const newBalance = document.getElementById('balance')

const betSizeInput = document.getElementById('bet-size')
const placeTheBet = document.getElementById('place-bet')
const betAmountEl = document.getElementById('bet-amount')

const playerHandScore = document.getElementById('hand-value')
const dealerHandScore = document.getElementById('dealer-value')

const hitButton = document.getElementById('hit')
const standButton = document.getElementById('stand')
const doubleDownButton = document.getElementById('double')

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
let betAmount = 0
let currentHandValue = 0
let dealerHandValue = 0
let playerHasBlackJack = false
let dealerHasBlackJack = false
let playerHasAce = null
let dealerHasAce = null
let playerWonHand = null
let handIsPush = null
let hasDoubledDown = false
let playerBusted = false
let dealerBusted = false
let playerHasStood = false


const deckCreator = makeDeck()
const currentDeck = new Deck(deckCreator)

currentDeck.shuffleCards()

const playerCardOne = currentDeck.cards.pop()
const dealerCardOne = currentDeck.cards.pop()
const playerCardTwo = currentDeck.cards.pop()
const dealerCardTwo = currentDeck.cards.pop()



/*----- cached elements  -----*/

// I will store all the button elements here
// All varibles in charge of getting user inputs are here

/*----- event listeners -----*/



/*----- MAIN GAMEPLAY -> MAIN FUNCTION THAT PUTS TOGETHER ALL SUB-FUNCTIONS AND RUNS THE ENTIRE GAME -----*/

function playBlackJack() {

    //first, ensure that before cards are shown, the player has a balance higher than 0
    if (balance === 0) {
        balanceSetter()
    }
    if (betAmount === 0) {
        placeBet()
    }

    startHand()
    playerHandScore.innerText = scoreHand(playerCardOne, playerCardTwo, currentHandValue)
    dealerHandScore.innerText = scoreHand(dealerCardOne, dealerCardTwo, dealerHandValue)
    
    currentHandValue = parseInt(playerHandScore.innerText)
    dealerHandValue = parseInt(dealerHandScore.innerText)
    checkForBlackJack(currentHandValue, dealerHandValue)
    
    // This below consitional will determine who wins the hand in all blackjack senarios, and react accordiingly
    if (playerHasBlackJack === true && dealerHasBlackJack === false) {
        playerWonHand = true
        // pay player 1.25x the bet
        // reset game
    }
    else if (playerHasBlackJack === false && dealerHasBlackJack === true) {
        playerWonHand === false
        // flip over dealer second card to reveal blackjack
        // reset game 
    }
    else if (playerHasBlackJack === true && dealerHasBlackJack === true) {
        handIsPush === true
        // flip over dealer second card to reveal blackjack
        // pay back player's initial bet only
        // reset game
    }
    
    if (playerCardOne.value === 'A' || playerCardTwo.value === 'A') {
        playerHasAce = true
    }
    if (dealerCardOne.value === 'A' || dealerCardTwo.value === 'A') {
        dealerHasAce = true
    }
    
    
    hit(currentHandValue)

    stand(dealerHandValue)

    doubleDown(currentHandValue)

    if(playerBusted === true || playerHasStood === true){
        determineWinner()
    }






























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

    playerSection.appendChild(renderCard(playerCardOne))
    dealerSection.appendChild(renderCard(dealerCardOne))
    playerSection.appendChild(renderCard(playerCardTwo))
    dealerSection.appendChild(renderCard(dealerCardTwo)) //THIS CARD NEEDS TO BE HIDDEN

    return currentDeck, playerCardOne, playerCardTwo, dealerCardOne, dealerCardTwo
}
// function in charge of setting inital player balance 
function balanceSetter() {
    submitter.addEventListener('click', function(){
        let balanceUpdater = deposit.value
        if(!isNaN(deposit.value)) {
            let balanceInt = parseInt(balanceUpdater)
            if(balanceInt <= 5000) {
                balance += balanceInt
            }
        }
        deposit.value = ''
        newBalance.innerText = `${balance}`
    })
    return balance
}
// function in charge of placing bet

function placeBet() {
    placeTheBet.addEventListener('click', function(){
        if(betSizeInput.value > balance) {
            betSizeInput.value = ''
            return
        }
        else {
            betAmount = betSizeInput.value
            balance -= betAmount
            newBalance.innerText = `${balance}`
            betAmountEl.innerText = `${betAmount}`
        }
        betSizeInput.value = ''
        return betAmount, balance
    })
}

// function in charge of assessing each cards numerical value, and scoring it
function scoreHand(cardOne, cardTwo, val) {
    if (cardOne.value === 'A' && cardTwo.value === 'A') {
        val = 12
    }

    if (cardOne.value === 'J' || cardOne.value === 'Q'|| cardOne.value === 'K'){
        val += 10
    }
    else if (cardOne.value <= 10) {
        val += parseInt(cardOne.value)
    }
    else {
        if ((parseInt(cardTwo.value) + 11) > 21) {
            val ++
        }
        else {
            val += 11
        }
    }

    if (cardTwo.value === 'J' || cardTwo.value === 'Q'|| cardTwo.value === 'K'){
        val += 10
    }
    else if (cardTwo.value <= 10) {
        val += parseInt(cardTwo.value)
    }
    else {
        if ((parseInt(cardOne.value) + 11) > 21) {
            val ++
        }
        else {
            val += 11
        }
    }

    return val
}

// this function checks for blackjacks
function checkForBlackJack(currentHandValue, dealerHandValue) {
    if (currentHandValue === 21) {
        return playerHasBlackJack = true
    }
    if (dealerHandValue === 21) {
        return dealerHasBlackJack = true
    }
}

// function in charge of responding to a "hit"
function hit(currentHandValue) {
    hitButton.addEventListener('click', function(){
        // checks for reason to make click useless
        if (playerHasBlackJack === true || hasDoubledDown === true) {
            return
        }
        else if (currentHandValue >=21) {
            return
        }

        // create and render new card
        let newPlayerCard = currentDeck.cards.pop()
        playerSection.appendChild(renderCard(newPlayerCard))

        // score hand after new card is rendered
        if (newPlayerCard.value === 'J' || newPlayerCard.value === 'Q'|| newPlayerCard.value === 'K') {
            currentHandValue += 10
        }
        else if (newPlayerCard.value === 'A') {
            if (currentHandValue <=10) {
                currentHandValue += 11
            }
            else {
                currentHandValue ++
            }
        }
        else {
            currentHandValue += parseInt(newPlayerCard.value)
        }

        // reduce score if player has an ace and is currently at 'Bust!'
        if (currentHandValue > 21 && playerHasAce === true) {
            currentHandValue -= 10
            playerHasAce = null
        }

        // RARE OCCURANCE, LATER ON DEAL WITH IF A PLAYER HAS TWO ACES, THIS WILL SUCK
        
        // deal with bust scenarios
        if (currentHandValue > 21) {
            playerHandScore.innerText = currentHandValue
            return currentHandValue, playerBusted = true
            // show dealer second card
            //reset game
        }
        else if (currentHandValue === 21) {

            playerHandScore.innerText = currentHandValue
            return currentHandValue
        }
        else {
            playerHandScore.innerText = currentHandValue
            return currentHandValue
        }
    })
    
}
// function in charge of standing then running dealer cards
function stand(dealerHandValue) {
    standButton.addEventListener('click', function(){
        if (playerBusted === true){
            return
        }
        playerHasStood = true

        while (dealerHandValue < 17) {
            let newDealerCard = currentDeck.cards.pop()
            dealerSection.appendChild(renderCard(newDealerCard))
            if (newDealerCard.value === 'J' || newDealerCard.value === 'Q'|| newDealerCard.value === 'K') {
                dealerHandValue += 10
            }
            else if (newDealerCard.value === 'A') {
                if (dealerHandValue <=10) {
                    dealerHandValue += 11
                }
                else {
                    dealerHandValue ++
                }
            }
            else {
                dealerHandValue += parseInt(newDealerCard.value)
            }

            if (dealerHandValue <= 21) {
                dealerHandScore.innerText = dealerHandValue
                return dealerHandValue
            }
            else {
                dealerHandScore.innerText = dealerHandValue
                return dealerHandValue, dealerBusted = true
            }
        }
    })
}
// function in charge of responding to "double down"
function doubleDown(currentHandValue) {
    doubleDownButton.addEventListener('click', function(){
        // check if player has already doubled down
        if (hasDoubledDown === true){
            return
        }
        // double the bets size and reduce balance properly
        balance -= betAmount
        betAmount = (2 * betAmount)
        newBalance.innerText = `${balance}`
        betAmountEl.innerText = `${betAmount}`

        // draw one card from deck
        let doubleDownCard = currentDeck.cards.pop()
        playerSection.appendChild(renderCard(doubleDownCard))

        // score the card
        if (doubleDownCard.value === 'J' || doubleDownCard.value === 'Q'|| doubleDownCard.value === 'K') {
            currentHandValue += 10
        }
        else if (doubleDownCard.value === 'A') {
            if (currentHandValue <=10) {
                currentHandValue += 11
            }
            else {
                currentHandValue ++
            }
        }
        else {
            currentHandValue += parseInt(doubleDownCard.value)
        }
        // adjust for previous aces
        if (currentHandValue > 21 && playerHasAce === true) {
            currentHandValue -= 10
            playerHasAce = null
        }
        // deal with bust scenarios
        if (currentHandValue > 21) {
            playerWonHand === false
            playerHandScore.innerText = currentHandValue
            return currentHandValue, hasDoubledDown = true, playerBusted = true
        }
        else if (currentHandValue === 21) {
            playerHandScore.innerText = currentHandValue
            return currentHandValue, hasDoubledDown = true
        }
        else {
            playerHandScore.innerText = currentHandValue
            return currentHandValue, hasDoubledDown = true
        }
    })
}
// function in charge of hiding dealer's card, as well as playing out the rest of his hand
// function in charge of determining winner
function determineWinner() {
    if (playerBusted === true) {
        playerLost()
    }
    else if (dealerBusted === true) {
        playerWon()
    }
    else if (currentHandValue > dealerHandValue) {
        playerWon()
    }
    else if (dealerHandValue > currentHandValue) {
        playerLost()
    }
    else if (currentHandValue === dealerHandValue) {
        playerPush()
    }
    return console.log(balance, betAmount)
}

// function that disperses winnings and resets bets/adjusts balance
function playerWon(){
    if (playerHasBlackJack === true) {
        balance = balance + (2.5 * betAmount)
    }
    else {
        balance = balance + (2 * betAmount)
    }
    newBalance.innerText = `${balance}`
    betAmountEl.innerText = 0
    betAmount = 0
    return betAmount, balance
}

// function for when player loses: reset bet and adjust balance
function playerLost(){
    betAmount = 0
    betAmount.innerText = 0
    return betAmount
}

// function handles a player/dealer push
function playerPush(){
    balance = balance + betAmount
    newBalance.innerText = `${balance}`
    betAmountEl.innerText = 0
    betAmount = 0
    return betAmount, balance
}
// function to quit/resets
function resetHand() {
    playerHandScore.innerText = 0
    dealerHandScore.innerText = 0
    currentHandValue = 0
    playerSection.replaceChildren()
    dealerSection.replaceChildren()

    return currentHandValue
}
// There will probably be more... AGGGHHHH

playBlackJack()













// Below is old code that I commented out for now

// Balance Getter:

// submitter.addEventListener('click', function(){
//     let balanceUpdater = deposit.value
//     if(!isNaN(deposit.value)) {
//         let balanceInt = parseInt(balanceUpdater)
//         if(balanceInt <= 5000) {
//             balance += balanceInt
//         }
//     }
//     deposit.value = ''
//     newBalance.innerText = `${balance}`
// })
