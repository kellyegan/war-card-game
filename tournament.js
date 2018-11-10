"use strict";

const testPlayers = [
 { id: 0, rank: 5 },
 { id: 1, rank: 6 },
 { id: 2, rank: 4 },
 { id: 3, rank: 3 },
 { id: 4, rank: 5 },
 { id: 5, rank: 1 },
 { id: 6, rank: 3 },
 { id: 7, rank: 5 },
 { id: 8, rank: 0 },
 { id: 9, rank: 1 },
];

/**
 *  Single-elimination tournament, ranked list of players and number of tournament slots
 */
function Tournament( players, slots ) {
	this.slots = slots;
	this.players = players;
	this.games = [];
}

Tournament.prototype.play = function () {
	const sorted = this.players.sort( (a, b) => {return b.rank - a.rank});
	console.log(sorted);
}

const tournament = new Tournament(testPlayers, 8);
tournament.play();

module.exports = Tournament;
