# project1-blackjack
This is my first project for General Assembly. I chose blackjack because I am fairly comfortable with javascript, but still wanted to challenge myself. I don't know how I will be able to complete this, it will take lots of research, but I feel a sense of excitement to get started!

# What is Blackjack?
Blackjack is a gambling game where you, the player, goes up against a dealer, who represents the house (casino). You and the dealer are each dealt two cards from a standard 52-card deck. Each card represents a value (1-11). Upon recieving your two cards, you have two goals in mind: 

1 - make your cards add up to a number near or exactly 21, without going over 21
2 - To "beat the dealer" meaning your cards are closer to 21 than his, or have the dealer "bust", which means his cards add up to over 21

After recieving your cards, you can either "hit", which means you add another card to your deck, or you "stand" meaning you keep the number of cards you have at that point and hope you win! You can also "Double down", which will be explained later. If you ever "hit" and have your cards add up to over 21, you "bust", which means you lose that hand.

# Goals for this program
- Find a way to represent and use a standard 52 card deck through code
- Find a way to visually display each individual card to the browser
- Design a nice UI that has buttons for every possible choice to make in every blackjack scenario
- Create an actual gambling-like simulation, by including a manipulatable balance, min/max bets, etc
- Properly impliment the rules of blackjack, and be able to determine if the player wins/loses the hand
- Actively track player stats on screen (Balance, Wins, Loses, Current Score, etc.)

# Bonus goals if I have time
- Find a way to take in user input to get a name from the player
- Possibly pre-program some 'one-liners' for the dealer that he will use to tease the player
- EASTER EGGS???

# PSEUDOCODE

/*----- constants -----*/

// Here I will need the class for a deck of cards

/*----- state variables -----*/

// Here I will need to declare a lot of variables, including all the varaibles for my stats section (wins, loses, balance, hand value)
// I will need a timer that will autopick if the player does not make a valid choice in time
// I will keep booleans here (wonHand, affordBet, showDealerCard, isBust, isBlackJack, etc)

/*----- cached elements  -----*/

// I will store all the varibles here charge of the images for each card
// I will store all the button elements here
// All varibles in charge of getting user inputs are here

/*----- event listeners -----*/

//  Listen for player choices and respond accoringly
// This could include bet amount, hit/stand/doubledown, or quit game

/*----- functions -----*/

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

