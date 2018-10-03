/**
 *  Hold a game of war (card game)
 */
function War( numberOfPlayers = 2 ) {
	this.deck = shuffle(createDeck());
	this.players = [];
	this.rounds = [];

	for( let i = 0; i < numberOfPlayers; i++) {
		this.players.push( new Player() );
	}
}

/**
 *  Deal card to players
 */
War.prototype.deal = function () {
	let index = 0;

	while( this.deck.length > 0 ) {
		let card = this.deck.pop();
		this.players[index].takeCards([card])
		index = (index + 1) % this.players.length;
	}
}

War.prototype.play = function () {
	while( this.playRound() && this.rounds.length < 10000){
		//Report something?
	}
	return(this.rounds.length);
}


/**
 *  Plays one round of the game.
 */
War.prototype.playRound = function () {
	let activePlayers = [];
	let prize = [];
	let flag = false;
	//Check if there was a previous round
	const lastRound = this.rounds.length > 0 ? this.rounds[this.rounds.length-1] : null;

	//If there was a last round and more than one winner last round (a tie)...
	if( lastRound && lastRound.winners.length > 1 ) {
		//...make those winners the activePlayers
		activePlayers = lastRound.winners.slice();
		//and add the previous prize to the current round
		prize = lastRound.prize.slice();
		activePlayers.forEach( (playerIndex) => {
			prize.push(this.players[playerIndex].playCard() );
		})
	} else {
		//...otherwise include all players with cards left
		this.players.forEach( (player, index) => {
			if( player.hasCards() ) {
				activePlayers.push(index);
			}
		});
	}

	//If there is more than one player left play round
	if( activePlayers.length > 1 ) {
		let round = new Round(activePlayers, this.players, prize);

		if( round.winners.length === 1) {
			//We have a winner
			const winnerIndex = round.winners[0];
			this.players[winnerIndex].takeCards(round.prize);
		}
		this.rounds.push( round );
		return true;
	}
	return false;
}

/**
 *  Object to hold the results of an individual round
 */
function Round( activePlayers, players, prize = [] ) {
	//Filter out players with no cards remaining
	this.activePlayers = activePlayers.filter( playerIndex => players[playerIndex].hasCards() );

	//Add the active players
	this.play = [];
	this.activePlayers.forEach( (playerIndex) => {
		this.play.push( players[playerIndex].playCard() );
	});

	//Add current play to any existing prize
	this.prize = prize.concat(this.play);

	//Find the max value among players
	let max = this.play.reduce( (a,b) => {
		return Math.max(a.value, b.value);
	});

	//Calculate the winners
	this.winners = [];
	this.play.forEach( (card, index) => {
		if( card.value === max ) {
			this.winners.push( this.activePlayers[index] );
		}
	});
}


/**
 *  Object to hold player information
 */
function Player(name = '') {
	this.name = name;
	this.hand = [];
	this.discard = [];
}

/**
 *  Play a card from players hand. If no card in hand use discard. If nothing in discard, return null.
 */
Player.prototype.playCard = function () {
	if( this.hand.length === 0 ) {
		if( this.discard.length > 0 ) {
//			Shuffle cards before using
			this.hand = this.discard.concat(this.hand);
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
 *  Creates a deck of cards and return a CardPile
 */
function createDeck() {
	let suits = ["Clubs","Diamonds","Hearts","Spades"];
	let ranks = ["Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten", "Jack","Queen","King"];

	let cards = [];
	let count = 0;

	suits.forEach((suit) => {
		ranks.forEach((rank, index) => {
			cards[count] = new Card( rank + " of " + suit, index);
			count++;
		});
	});

	return cards;
}

/**
 *  Object to hold a deck of cards
 */
function CardPile(cards = []) {
	this.cards = cards;
}

/**
 *  Shuffle the deck of cards
 */
CardPile.prototype.shuffle = function () {
	var m = this.cards.length, t, i;

	while (m) {
		// Pick a remaining element…
		i = Math.floor(Math.random() * m--);

		// And swap it with the current element.
		t = this.cards[m];
		this.cards[m] = this.cards[i];
		this.cards[i] = t;
  	}
}

/**
 * Are there any card in the pile?
 */
CardPile.prototype.hasCards = function () {
	return this.cards.length > 0;
}

/**
 *  Play the top card on a pile.
 */
CardPile.prototype.playCard = function () {
	return this.cards.length > 0 ? this.cards.pop() : null;
}

/**
 *  Add card to bottom the top card on a pile.
 */
CardPile.prototype.addCard = function (card) {
	this.cards.unshift(card);
}

/**
 *
 */
CardPile.prototype.addPile = function (otherPile) {
	otherPile.cards.forEach( (card) => {
		this.addCard(card);
	})
}

/**
 *  Object to hold a single card
 */
function Card(name, value) {
	this.name = name;
	this.value = value;
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


