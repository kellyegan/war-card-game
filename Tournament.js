"use strict";

const War = require('./war.js');

/**
 *  Single-elimination tournament, ranked list of players and number of tournament slots
 *
 *  Useful link: https://stackoverflow.com/questions/22859730/generate-a-single-elimination-tournament
 */
function Tournament( players, tournamentSpots ) {
	this.games = [];
	const slots = smallestPowerOf(2, tournamentSpots);
	this.players = players;

	this.finalists = this.players.slice().sort( (a,b) => {
		return b.rating - a.rating;
	}).slice(0, tournamentSpots).map( player => {
		return player.id
	});

	//Fill in empty slots until you reach next power of two
	while(this.finalists.length < slots) {
		this.finalists.push(null);
	}
}


Tournament.prototype.play = function () {
	let remainingPlayers = this.finalists.slice();

	let round = 0;
	while( remainingPlayers.length > 1) {
		let winners = [];

		for( let i = 0; i < remainingPlayers.length / 2; i++){
			let playerOneID = remainingPlayers[i];
			let playerTwoID = remainingPlayers[remainingPlayers.length - (1 + i)];

			if( playerOneID !== null ){
				if( playerTwoID !== null ){
					const game = new War(2, 1);
					game.deal();
					const winner = game.play() == 0 ? playerOneID : playerTwoID;

					const gameID = this.games.length;

					this.games.push({
						id: gameID,
						round: round,
						players: [ 
							{id: playerOneID, person: this.players[playerOneID].person}, 
							{id: playerTwoID, person: this.players[playerTwoID].person} 
						],
						winner: winner,
					  hands: game.hands
					});

					this.players[playerOneID].finals.push({
							id: gameID,
							opponent: playerTwoID,
							win:  winner == playerOneID,
						});

					this.players[playerOneID].finals.push({
							id: gameID,
							opponent: playerOneID,
							win:  winner == playerTwoID,
						});

					winners.push(winner);
				} else {
					//No match this round. playerOne goes to next round
					winners.push(playerOneID);
				}
			} else if( playerTwoID !== null ){
				//No match this round. playerTwo goes to next round
				winners.push(playerTwoID);
			} else {
				//Hmm both players are null?
			}
		}
		round++;
		remainingPlayers = winners;
	}
}

/**
 *  Find the smallest power of base that is greater than or equal to number
 */
function smallestPowerOf( base, number ){
	return Math.pow( base, Math.ceil(Math.log(number) / Math.log(base)));
}

module.exports = Tournament;
