"use strict";

/**
 *  Single-elimination tournament, ranked list of players and number of tournament slots
 *
 *  Useful link: https://stackoverflow.com/questions/22859730/generate-a-single-elimination-tournament
 */
function Tournament( players ) {
	this.games = [];
	const slots = smallestPowerOf(2, players.length);
	this.players = players;

	while(this.players.length < slots) {
		this.players.push(null);
	}
	console.log(this.players)
}

Tournament.prototype.play = function () {
	const sorted = this.players.sort( (a, b) => {return b.rank - a.rank});
	console.log(sorted);
}

/**
 *  Find the smallest power of base that is greater than or equal to number
 */
function smallestPowerOf( base, number ){
	return Math.pow( base, Math.ceil(Math.log(number) / Math.log(base)));
}

for( let i = 0; i < 18; i++) {
	console.log(`${i} ${smallestPowerOf(2,i)}` );
}

module.exports = Tournament;
