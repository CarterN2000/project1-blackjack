
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
const announcerEl = document.getElementsByClassName('announcer')

const hitButton = document.getElementById('hit')
const standButton = document.getElementById('stand')
const doubleDownButton = document.getElementById('double')
const dealCardsButton = document.getElementById('deal-cards')
const nextHandButton = document.getElementById('reset')

const playerTitle = document.createElement('h4')
playerTitle.innerText = "Player's Cards"
const dealerTitle = document.createElement('h4')
dealerTitle.innerText = "Dealer's Cards"

class Deck {
    constructor(cards) {
        this.cards = cards
    }
    shuffleCards() {
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
let playerNumOfCards = 0
let dealerNumOfCards = 0

let playerHasBlackJack = false
let dealerHasBlackJack = false
let playerHasAce = null
let dealerHasAce = null
let hasDoubledDown = false
let playerHasHit = false
let playerBusted = false
let dealerBusted = false
let playerHasStood = false
let cardsWereDealt = false
let thereIsWinner = false
let alreadyPlacedBet = false
let firstTwoAreAces = false
let dealerFirstTwoAreAces = false

let currentDeck = null
let playerCardOne = null
let playerCardTwo = null
let dealerCardOne = null
let dealerCardTwo = null
let backCardEl = null


/*----- cached elements  -----*/


/*----- event listeners -----*/



/*----- MAIN GAMEPLAY -> MAIN FUNCTION THAT PUTS TOGETHER ALL SUB-FUNCTIONS AND RUNS THE ENTIRE GAME -----*/

function playBlackJack() {


    placeBet()
    balanceSetter()

    dealCardsButton.addEventListener('click', function () {
        //first, ensure that before cards are shown, the player has a balance higher than 0
        if (alreadyPlacedBet === false || cardsWereDealt === true) {
            return
        }

        startHand()
        playerHandScore.innerText = scoreHand(playerCardOne, playerCardTwo, currentHandValue, firstTwoAreAces)
        dealerHandValue = scoreHand(dealerCardOne, dealerCardTwo, dealerHandValue, dealerFirstTwoAreAces)

        // ensures user cannot spam "deal cards" button
        cardsWereDealt = true

        currentHandValue = parseInt(playerHandScore.innerText)
        checkForBlackJack(currentHandValue, dealerHandValue)

        // This below consitional will determine who wins the hand in all blackjack senarios, and react accordiingly
        if (playerHasBlackJack === true && dealerHasBlackJack === false) {
            determineWinner()
            showSecondCard()
            betAmountEl.innerText = 'BlackJack!!! You win!'
        }
        else if (playerHasBlackJack === false && dealerHasBlackJack === true) {
            determineWinner()
            showSecondCard()
            betAmountEl.innerText = 'Dealer BlackJack! House wins!'
            // flip over dealer second card to reveal blackjack
        }
        else if (playerHasBlackJack === true && dealerHasBlackJack === true) {
            determineWinner()
            showSecondCard()
            betAmountEl.innerText = 'You and the dealer both had BlackJack, its a push'
            // flip over dealer second card to reveal blackjack
        }

        if (playerCardOne.value === 'A' || playerCardTwo.value === 'A') {
            playerHasAce = true
        }
        if (dealerCardOne.value === 'A' || dealerCardTwo.value === 'A') {
            dealerHasAce = true
        }
    })

    hit()
    stand()
    doubleDown()

    nextHandButton.addEventListener('click', function () {
        if (thereIsWinner === false) {
            return
        }
        resetHand()
        initializeDeck()
    })
}

/*----- functions -----*/

// function in charge or making a deck of cards and shuffling them
function makeDeck() {
    return SUITS.flatMap(function (suit) {
        return VALUES.map(function (value) {
            return new Card(suit, value)
        })
    })
}

// This is the function used to render a card from the deck onto the screen
function renderCard(card) {
    const newCard = document.createElement('div')
    newCard.innerText = `${card.value}${card.suit}`
    newCard.classList.add('cards')
    if (card.suit === "♠" || card.suit === "♣") {
        newCard.style.color = 'black'
    }
    else {
        newCard.style.color = 'red'
    }
    return newCard
}

// function that renders the back of the playing card
function renderTheBack() {
    const backOfCard = document.createElement('div')
    backOfCard.innerText = 'Dis da back of da card'
    backOfCard.classList.add('back-of-card')
    return backOfCard
}

// function in charge of initializing/starting the game
function startHand() {
    playerSection.appendChild(renderCard(playerCardOne))
    dealerSection.appendChild(renderCard(dealerCardOne))
    playerSection.appendChild(renderCard(playerCardTwo))
    backCardEl = renderTheBack()
    dealerSection.appendChild(backCardEl) //THIS CARD NEEDS TO BE HIDDEN

    playerNumOfCards = 2
    dealerNumOfCards = 2
}
// function in charge of setting inital player balance 
function balanceSetter() {
    submitter.addEventListener('click', function () {
        let balanceUpdater = deposit.value
        if (!isNaN(deposit.value)) {
            let balanceInt = parseInt(balanceUpdater)
            if (balanceInt <= 5000) {
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
    placeTheBet.addEventListener('click', function () {
        if (alreadyPlacedBet === true) {
            betSizeInput.value = ''
            return
        }

        if (betSizeInput.value > balance || parseInt(betSizeInput.value) < 0) {
            betSizeInput.value = ''
            return
        }
        else {
            if (betSizeInput.value === '0' || betSizeInput.value === '') {
                betAmountEl.innerText = 'Free play!'
                betAmount = 0
                balance -= betAmount
                newBalance.innerText = `${balance}`

            }
            else {
                betAmount = betSizeInput.value
                balance -= betAmount
                newBalance.innerText = `${balance}`
                betAmountEl.innerText = `Current Bet: ${betAmount}`
            }


        }
        alreadyPlacedBet = true
        betSizeInput.value = ''
        return betAmount, balance
    })
}

// function in charge of assessing each cards numerical value, and scoring it
function scoreHand(cardOne, cardTwo, val, TwoAces) {
    if (cardOne.value === 'J' || cardOne.value === 'Q' || cardOne.value === 'K') {
        val += 10
    }
    else if (cardOne.value <= 10) {
        val += parseInt(cardOne.value)
    }
    else {
        if ((parseInt(cardTwo.value) + 11) > 21) {
            val++
        }
        else {
            val += 11
        }
    }

    if (cardTwo.value === 'J' || cardTwo.value === 'Q' || cardTwo.value === 'K') {
        val += 10
    }
    else if (cardTwo.value <= 10) {
        val += parseInt(cardTwo.value)
    }
    else {
        if ((parseInt(cardOne.value) + 11) > 21) {
            val++
        }
        else {
            val += 11
        }
    }

    if (cardOne.value === 'A' && cardTwo.value === 'A') {
        val = 12
        TwoAces = true
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
function hit() {
    hitButton.addEventListener('click', function () {
        // checks for reason to make click useless
        if (playerHasBlackJack === true || hasDoubledDown === true || playerHasStood === true || dealerHasBlackJack === true) {
            return
        }
        else if (currentHandValue >= 21 || cardsWereDealt === false) {
            return
        }

        playerHasHit = true

        // create and render new card
        let newPlayerCard = currentDeck.cards.pop()
        playerSection.appendChild(renderCard(newPlayerCard))
        playerNumOfCards++

        // score hand after new card is rendered
        if (newPlayerCard.value === 'J' || newPlayerCard.value === 'Q' || newPlayerCard.value === 'K') {
            currentHandValue += 10
        }
        else if (newPlayerCard.value === 'A') {
            if (playerHasAce === false) {
                playerHasAce = true
            }
            if (currentHandValue <= 10) {
                currentHandValue += 11
            }
            else {
                currentHandValue++
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
        if (firstTwoAreAces === true) {
            dealtTwoAces(currentHandValue, newPlayerCard, playerNumOfCards)
        }
        // deal with bust scenarios
        if (currentHandValue > 21) {
            playerHandScore.innerText = currentHandValue
            playerBusted = true
            determineWinner()
            // show dealer second card
            //reset game
        }
        else if (currentHandValue === 21) {

            playerHandScore.innerText = currentHandValue
        }
        else {
            playerHandScore.innerText = currentHandValue
        }
    })

}
// function in charge of standing then running dealer cards
function stand() {
    standButton.addEventListener('click', function () {
        if (playerBusted === true || cardsWereDealt === false) {
            return
        }
        playerHasStood = true
        dealerDraw()
        determineWinner()
    })
}
// function in charge of responding to "double down"
function doubleDown() {
    doubleDownButton.addEventListener('click', function () {
        // check if player has already doubled down
        if (hasDoubledDown === true || playerHasHit === true || playerHasStood === true || cardsWereDealt === false || dealerHasBlackJack === true) {
            return
        }
        if ((balance - betAmount) < 0) {
            return
        }

        hasDoubledDown = true

        // double the bets size and reduce balance properly
        balance -= betAmount
        betAmount = (2 * betAmount)
        newBalance.innerText = `${balance}`
        betAmountEl.innerText = `Current Bet: ${betAmount}`

        // draw one card from deck
        let doubleDownCard = currentDeck.cards.pop()
        playerSection.appendChild(renderCard(doubleDownCard))

        // score the card
        if (doubleDownCard.value === 'J' || doubleDownCard.value === 'Q' || doubleDownCard.value === 'K') {
            currentHandValue += 10
        }
        else if (doubleDownCard.value === 'A') {
            if (currentHandValue <= 10) {
                currentHandValue += 11
            }
            else {
                currentHandValue++
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

        dealerDraw()

        // deal with bust scenarios
        if (currentHandValue > 21) {
            playerHandScore.innerText = currentHandValue
            playerBusted = true
        }
        else if (currentHandValue === 21) {
            playerHandScore.innerText = currentHandValue
        }
        else {
            playerHandScore.innerText = currentHandValue
        }
        determineWinner()
    })
}
// function in charge of hiding dealer's card, as well as playing out the rest of his hand
function dealerDraw() {
    showSecondCard()
    while (dealerHandValue < 17) {
        // create and render a new card
        let newDealerCard = currentDeck.cards.pop()
        dealerSection.appendChild(renderCard(newDealerCard))
        dealerNumOfCards++

        //check value
        if (newDealerCard.value === 'J' || newDealerCard.value === 'Q' || newDealerCard.value === 'K') {
            dealerHandValue += 10
        }
        else if (newDealerCard.value === 'A') {
            if (dealerHasAce === false) {
                dealerHasAce = true
            }
            if (dealerHandValue <= 10) {
                dealerHandValue += 11
            }
            else {
                dealerHandValue++
            }
        }
        else {
            dealerHandValue += parseInt(newDealerCard.value)
        }

        if (dealerHandValue > 21 && dealerHasAce === true) {
            dealerHandValue -= 10
            dealerHasAce = null
        }

        // RARE OCCURANCE, LATER ON DEAL WITH IF A PLAYER HAS TWO ACES, THIS WILL SUCK
        if (dealerFirstTwoAreAces === true) {
            dealtTwoAces(dealerHandValue, newDealerCard, dealerNumOfCards)
        }

        if (dealerHandValue <= 21) {
            dealerHandScore.innerText = dealerHandValue
            if (dealerHandValue >= 17) {
                return dealerHandValue
            }
        }
        else {
            dealerHandScore.innerText = dealerHandValue
            return dealerHandValue, dealerBusted = true
        }
    }
}
// function in charge of determining winner
function determineWinner() {
    thereIsWinner = true
    if (playerBusted === true) {
        showSecondCard()
        playerLost()
        betAmountEl.innerText = 'You busted! House Wins!'
    }
    else if (dealerBusted === true) {
        playerWon()
        betAmountEl.innerText = 'Dealer Busted! You Win!'
    }
    else if (currentHandValue > dealerHandValue) {
        playerWon()
        betAmountEl.innerText = `You beat the dealer's ${dealerHandValue} with a ${currentHandValue}`
    }
    else if (dealerHandValue > currentHandValue) {
        playerLost()
        betAmountEl.innerText = `The dealer beat your ${currentHandValue} with a ${dealerHandValue}`
    }
    else if (currentHandValue === dealerHandValue) {
        playerPush()
        betAmountEl.innerText = `You and the dealer both had a ${dealerHandValue}, it's a push!`
    }
}

// function that disperses winnings and resets bets/adjusts balance
function playerWon() {
    if (playerHasBlackJack === true) {
        balance = balance + (2.5 * betAmount)
    }
    else {
        balance = balance + (2 * betAmount)
    }
    newBalance.innerText = `${balance}`
    betAmountEl.innerText = 0
    betAmount = 0
}

// function for when player loses: reset bet and adjust balance
function playerLost() {
    betAmount = 0
    betAmount.innerText = 0
}

// function handles a player/dealer push
function playerPush() {
    balance += parseInt(betAmount)
    newBalance.innerText = `${balance}`
    betAmountEl.innerText = 0
    betAmount = 0
}

// function to quit/resets
function resetHand() {
    playerHandScore.innerText = 0
    dealerHandScore.innerText = '???'
    playerHasBlackJack = false
    dealerHasBlackJack = false
    playerHasAce = null
    dealerHasAce = null
    hasDoubledDown = false
    playerHasHit = false
    playerBusted = false
    dealerBusted = false
    playerHasStood = false
    cardsWereDealt = false
    thereIsWinner = false
    alreadyPlacedBet = false
    firstTwoAreAces = false
    dealerFirstTwoAreAces = false

    currentHandValue = 0
    dealerHandValue = 0
    playerNumOfCards = 0
    dealerNumOfCards = 0

    playerSection.replaceChildren()
    dealerSection.replaceChildren()

    playerSection.appendChild(playerTitle)
    dealerSection.appendChild(dealerTitle)
}

// function that initializes the start of a game
function initializeDeck() {
    let deckCreator = makeDeck()
    currentDeck = new Deck(deckCreator)

    currentDeck.shuffleCards()

    playerCardOne = currentDeck.cards.pop()
    dealerCardOne = currentDeck.cards.pop()
    playerCardTwo = currentDeck.cards.pop()
    dealerCardTwo = currentDeck.cards.pop()

    betAmountEl.innerText = 'Place your bet and press Deal Cards to start playing!'
}

// turns over dealer's hidden card
function showSecondCard() {
    dealerSection.removeChild(backCardEl)
    dealerSection.appendChild(renderCard(dealerCardTwo))
    dealerHandScore.innerText = `${dealerHandValue}`
}

// this function will attempt to deal with the instance where either the dealer or player is dealt two aces immediately
function dealtTwoAces(val, newCard, numOfCards) {
    if (newCard.value === 'J' || newCard.value === 'Q' || newCard.value === 'K') {
        if (numOfCards === 3) {
            val = 12
        }
        else {
            val += 10
        }
    }
    else if (newCard.value === 'A' && (11 + val > 21)) {
        val++
    }
}

initializeDeck()
playBlackJack()


//NOTES FOR WEDNESDAY

// figured out how to properly run messages in middle
// Hide dealer card
// Add timers










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


// If a use the event listeners as functions