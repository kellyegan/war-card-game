/**
 *  Hold a game of war (card game)
 */
function War( numberOfPlayers = 2 ) {
	this.deck = createDeck();
	this.deck.shuffle();
	this.players = [];

	for( let i = 0; i < numberOfPlayers; i++) {
		this.players.push( new Player() );
	}
}

/**
 *  Deal card to players
 */
War.prototype.deal = function () {
	let index = 0;

	while( this.deck.hasCards() ) {
		let card = this.deck.playCard();
		this.players[index].takeCards([card])
		index = (index + 1) % this.players.length;
	}
}

War.prototype.playRound = function (playerIndices) {
	let round = new Round(playerIndices, this.players, []);

	console.log(round);
}

/**
 *  Object to hold the results of an individual round
 */
function Round( activePlayers, players, prize = [] ) {
	//Array of indices of active players
	this.activePlayers = activePlayers;

	//Add the acrtiv
	this.play = [];
	this.activePlayers.forEach( (playerIndex) => {
		this.play.push(players[playerIndex].playCard() );
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
			this.winners.push(this.activePlayers[index]);
		}
	});
}


/**
 *  Object to hold player information
 */
function Player(name = '') {
	this.name = name;
	this.hand = new CardPile();
	this.discard = new CardPile();
}

/**
 *  Play a card from players hand. If no card in hand use discard. If nothing in discard, return null.
 */
Player.prototype.playCard = function () {
	if( !this.hand.hasCards() ) {
		if( this.discard.hasCards() ) {
			this.hand = this.discard;  //We could add a shuffle here
			this.discard = new CardPile();
		} else {
			//No cards left!
			return null;
		}
	}
	return this.hand.playCard();
}

/**
 *  Check if the player has cards in hand or discard
 */
Player.prototype.hasCards = function () {
	return this.hand.hasCards() || this.discard.hasCards();
}

/**
 *  Add card to players discard pile
 */
Player.prototype.takeCards = function (cards) {
	cards.forEach( (card) => {
		this.discard.addCard(card);
	});
}

/**
 *  Creates a deck of cards and return a CardPile
 */
function createDeck() {
	let suits = ["Clubs","Diamonds","Hearts","Spades"];
	let ranks = ["Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten","Jack","Queen","King","Ace"];

	let cards = [];
	let count = 0;

	suits.forEach((suit) => {
		ranks.forEach((rank, index) => {
			cards[count] = new Card( rank + " of " + suit, index);
			count++;
		});
	});

	return new CardPile(cards);
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


module.exports = War;


