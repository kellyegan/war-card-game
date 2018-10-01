/**
 Hold a game of war (card game)
 */
function War() {
	this.deck = new Deck();
}

/**
 Object to hold a deck of cards
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


/**
 Shuffle the deck of cards
 */
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
}

/**
 Object to hold a single card
 */
function Card(name, value) {
	this.name = name;
	this.value = value;
}


module.exports = War;


