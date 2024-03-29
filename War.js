"use strict";

const CardDeck = require("./CardDeck")

const MAX_ROUNDS = 10000;

/**
 *  Hold a game of war (card game)
 */
function War( numberOfPlayers, numberOfDecks ) {
	let cardDeck = new CardDeck.Deck();

	this.deck = [];

	for(let i = 0; i < numberOfDecks; i++) {
		this.deck = this.deck.concat(cardDeck.getDeck());
	}
	this.deck = shuffle(this.deck);

	this.players = [];
	this.hands = [];
	this.prize = [];
	this.war = false;
	this.activePlayers = [];

	for( let i = 0; i < numberOfPlayers; i++) {
		this.players.push( new Player() );
	}
}

/**
 *  Deal card to players
 */
War.prototype.deal = function () {
	let index = 0;

	const extraCards = this.deck.length % this.players.length;

	for( let i = 0; i < extraCards; i++) {
		this.prize.push(this.deck.shift());
	}

	while( this.deck.length > 0 ) {
		const card = this.deck.pop();
		this.players[index].takeCards([card])
		index = (index + 1) % this.players.length;
	}
}

/**
 *  Play the game. Returns the index of the winning player
 */
War.prototype.play = function () {
	while( this.playRound() && this.hands.length < MAX_ROUNDS){
		//Report something?
	}

	const lastRoundIndex = this.hands.length - 1;
	return(this.hands[lastRoundIndex].winners[0]);
}

/**
 *  Plays one round of the game.
 */
War.prototype.playRound = function () {
	let activePlayers = [];

	//If there was a war(a tie)...
	if( this.war ) {
		//...add new cards to the previous prize
		this.activePlayers.forEach( (playerIndex) => {
			if( this.players[playerIndex].hasCards() ) {
				this.prize.push(this.players[playerIndex].playCard() );
			}
		});
	} else {
		//...otherwise include all players with cards left
		this.activePlayers = [];
		this.players.forEach( (player, index) => {
			if( player.hasCards() ) {
				this.activePlayers.push(index);
			}
		});
	}

	//If there is more than one player left play round
	if( this.activePlayers.length > 1 ) {
		let hand = new Hand(this.activePlayers, this.players, this.prize, this.war);

		if( hand.winners.length === 1) {
			//We have a winner
			const winnerIndex = hand.winners[0];
			this.players[winnerIndex].takeCards(shuffle(hand.prize.slice()));

			// This is to make sure the current prize is included in the players counts
			hand.counts = this.players.map((player) => {return player.numberOfCards()});
			
			this.prize = [];
			this.war = false;
		} else {
			this.war = true;
			this.prize = hand.prize.slice();
			this.activePlayers = hand.activePlayers;
		}

		let totalCards = this.players.reduce( (total, player) => {
			return total + player.numberOfCards();
		}, 0);

		this.hands.push( hand.record() );
		return true;
	}
	return false;
}

/**
 *  Object to hold the results of an individual round
 */
function Hand( activePlayers, players, prize, war ) {

	//Create array to hold play cards
	this.war = war;
	this.activePlayers = [];
	this.play = [];

	//Each player plays a card. If they are out they are removed from the play.
	this.activePlayers = activePlayers.filter( (playerIndex) => {
		if( players[playerIndex].hasCards() ) {
			this.play.push( players[playerIndex].playCard() );
			return true;
		} else {
			return false;
		}
	});

	//Get current card counts for players
	this.counts = players.map((player) => {return player.numberOfCards()})

	//Add current play to any existing prize
	this.prize = prize.concat(this.play);

	//Find the winners
	this.winners = [];

	if( this.activePlayers.length > 1) {
		//Find the maximum
		const max = this.play.reduce( (maximum, current) => {
			return Math.max(maximum, current.value);
		}, -1);

		//Use the maximum to find all winners
		this.play.forEach( (card, index) => {
			if( card.value === max ) {
				this.winners.push( this.activePlayers[index] );
			}
		});
	} else {
		this.winners = this.activePlayers.slice();
	}
}

Hand.prototype.record = function () {
	return {
		"war": this.war,
		"activePlayers": this.activePlayers,
		"play": this.play,
		"counts": this.counts,
		"prize": this.prize.length,
		"winners": this.winners
	}
}


/**
 *  Object to hold player information
 */
function Player() {
	this.hand = [];
	this.discard = [];
}

/**
 *  Play a card from players hand. If no card in hand use discard. If nothing in discard, return null.
 */
Player.prototype.playCard = function () {
	if( this.hand.length === 0 ) {
		if( this.discard.length > 0 ) {
			this.hand = this.discard.slice();
			this.discard = [];
		} else {
			//No cards left!
			return null;
		}
	}
	return this.hand.pop();
}

/**
 *  Check if the player has cards in hand or discard
 */
Player.prototype.hasCards = function () {
	return this.hand.length > 0 || this.discard.length > 0;
}

/**
 *  Return total cards in hand and discard
 */
Player.prototype.numberOfCards = function () {
	return this.hand.length + this.discard.length;
}

/**
 *  Add card to players discard pile
 */
Player.prototype.takeCards = function (cards) {
	cards.forEach( (card) => {
		this.discard.unshift(card);
	});
}

/**
 *  Fisher-Yates Shuffle from Mike Bostock
 */
function shuffle(array) {
	var m = array.length, t, i;

	// While there remain elements to shuffle…
	while (m) {

		// Pick a remaining element…
		i = Math.floor(Math.random() * m--);

		// And swap it with the current element.
		t = array[m];
		array[m] = array[i];
	array[i] = t;
	}

	return array;
}

module.exports = War;
