const MAXROUNDS = 75000;

function Game(player1name, player2name) {
	this.players = [
		new Player(player1name),
		new Player(player2name)
	];

	this.deck = new Deck();
    this.rounds = [];
	this.warCount = 0;
}

//Deal the cards to the player
Game.prototype.deal = function () {
	let index = 0;
	while(this.deck.numberOfCards() > 0) {
		let card = this.deck.deal();
		this.players[index].gets( [card] );
		index = (index + 1) % this.players.length;
	}
};

//Play the game
Game.prototype.play = function () {
	let prize = [];


	this.deck.shuffle();
	this.deck.shuffle();

	this.deal();

	while( this.players[0].hasCards() && this.players[1].hasCards() ) {
		let play = [];


		let round = new Round();

		for(let i = 0; i < this.players.length; i++) {
			let card = this.players[i].playCard();
			play.push( card );
			prize.push( card );
		}

		round.prize = prize.slice();

		if( play[0].value > play[1].value ) {
			round.winner = 0;
			this.players[0].gets(prize);
			prize = [];
		} else if( play[0].value < play[1].value ) {
			round.winner = 1;
			this.players[1].gets(prize);
			prize = [];
		} else {
			this.warCount++;
			for(let i = 0; i < this.players.length; i++) {
				prize.push(this.players[i].playCard());
			}
		}

		round.play = play;
		round.counts = [this.players[0].hand.length, this.players[1].hand.length];

		this.rounds.push(round);

		if( this.rounds.length > MAXROUNDS) {
			return;
		}
	}
}

Game.prototype.playRound = function () {
	//Check that there is more than one player left
	let playersLeft = this.players.reduce( (total, currentPlayer) => {
		if( currentPlayer.hasCards() ) {
			return total + 1;
		} else {
			return total;
		}
	}, 0);


	if( playersLeft > 1) {
		//Play the round
		return true;
	} else {
		//Game over
		return null;
	}
}

function Round() {
	this.winner = -1;
	this.prize = [];
	this.play = [];
	this.counts = [];
}

//Define a player
function Player(name) {
	this.name = name;
	this.hand = [];
}

Player.prototype.hasCards = function () {
	return this.hand.length > 0;
}

Player.prototype.playCard = function () {
	return this.hand.pop();
}

Player.prototype.gets = function (cards) {
	cards.forEach( (card) => {
		this.hand.unshift(card);
	})
}

/**
 Playing card
 */
function Card(name, value) {
	this.name = name;
	this.value = value;
}

/**
 Deck of cards
 */
function Deck() {
	let suits = ["Clubs","Diamonds","Hearts","Spades"];
	let ranks = ["Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten","Jack","Queen","King","Ace"];

	this.cards = [];
	let count = 0;

	suits.forEach((suit) => {
		ranks.forEach((rank, index) => {
			this.cards[count] = new Card( rank + " of " + suit, index);
			count++;
		});
	});
}

Deck.prototype.shuffle = function () {
	var m = this.cards.length, t, i;

	while (m) {
		// Pick a remaining element…
		i = Math.floor(Math.random() * m--);

		// And swap it with the current element.
		t = this.cards[m];
		this.cards[m] = this.cards[i];
		this.cards[i] = t;
  	}
};

Deck.prototype.deal = function () {
	return this.cards.pop();
};

Deck.prototype.numberOfCards = function() {
	return this.cards.length;
}



// Fisher-Yates Shuffle from Mike Bostock
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

//
let game = new Game("Ted", "Fred");
let results = [];
let maxCount = 0;
let trials = 1000;

for( let i = 0; i < trials; i++) {
	game.play();
	if( game.rounds.length >= MAXROUNDS ) {
		maxCount++;
	}

	console.log(game.rounds.length + "\t" + game.warCount);

	results.push( game.rounds.length );
	game = new Game("Ted", "Fred");
}

console.log( maxCount / trials );


