function War() {
	this.deck = new Deck();
}

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

function Card(name, value) {
	this.name = name;
	this.value = value;
}

module.exports = War;


