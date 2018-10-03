/**
 *  Hold a game of war (card game)
 */
function War( numberOfPlayers = 2 ) {
	this.deck = shuffle(createDeck());
	this.players = [];
	this.rounds = [];
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

	while( this.deck.length > 0 ) {
		const card = this.deck.pop();
		this.players[index].takeCards([card])
		index = (index + 1) % this.players.length;
	}
}

War.prototype.play = function () {
	while( this.playRound() && this.rounds.length < 10000){
		//Report something?
	}

	this.rounds.splice(this.rounds.length - 20, this.rounds.length -1 ).forEach( round => {
		console.log(round);
	})
	return(this.rounds.length);
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
		let round = new Round(this.activePlayers, this.players, this.prize);

		if( round.winners.length === 1) {
			//We have a winner
			const winnerIndex = round.winners[0];
			this.players[winnerIndex].takeCards(shuffle(round.prize));
			this.prize = [];
			this.war = false;
		} else {
			this.war = true;
			this.prize = round.prize;
			this.activePlayers = round.activePlayers;
		}

		let totalCards = this.players.reduce( (total, player) => {
			return total + player.numberOfCards();
		}, 0);

		this.rounds.push( round );
		return true;
	}
	return false;
}

/**
 *  Object to hold the results of an individual round
 */
function Round( activePlayers, players, prize ) {

	//Filter out players with no cards remaining
	this.activePlayers = activePlayers.filter( playerIndex => players[playerIndex].hasCards() );

	//Add the active players
	this.play = [];

	//Each player plays a card. If they are out they are removed from the play.
	this.activePlayers = this.activePlayers.filter( (playerIndex) => {
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
		const max = this.play.reduce( (a,b) => {
			return Math.max(a.value, b.value);
		});

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
	let ranks = ["Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten", "Jack","Queen","King","Ace"];

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


