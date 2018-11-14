function Player(id) {
	this.id = id,
	this.games = [];
	this.finals = [];
	this.wins = 0;
	this.rating = 0;
}

module.exports = Player;
