"use strict";

const War = require('./war.js');

/**
 *  Single-elimination tournament, ranked list of players and number of tournament slots
 *
 *  Useful link: https://stackoverflow.com/questions/22859730/generate-a-single-elimination-tournament
 */
function Tournament( players ) {
	this.games = [];
	const slots = smallestPowerOf(2, players.length);
	this.players = players;

	//Fill in empty slots until you reach next power of two
	while(this.players.length < slots) {
		this.players.push(null);
	}
}

Tournament.prototype.play = function () {
	let remainingPlayers = this.players.map( (player, index) => {
		return player ? player.id : null;
	});
	console.log(remainingPlayers);

	let round = 0;
	while( remainingPlayers.length > 1) {
		let winners = [];

		for( let i = 0; i < remainingPlayers.length / 2; i++){
			let playerOneID = remainingPlayers[i];
			let playerTwoID = remainingPlayers[remainingPlayers.length - (1 + i)];

			if( playerOneID !== null ){
				if( playerTwoID !== null ){
					console.log(`Round ${round}: ${playerOneID} vs. ${playerTwoID}`);

					const game = new War(2, 1);
					game.deal();
					const winner = game.play() == 0 ? playerOneID : playerTwoID;

					const gameID = this.games.length;

					this.games.push({
						id: gameID,
						round: round,
						player1: playerOneID,
						player2: playerTwoID,
						winner: winner,
						// hands: game.hands
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
		console.log(remainingPlayers);
	}
	console.log(`Champion: ${remainingPlayers[0]}`);
	console.log(this.games);
}

/**
 *  Find the smallest power of base that is greater than or equal to number
 */
function smallestPowerOf( base, number ){
	return Math.pow( base, Math.ceil(Math.log(number) / Math.log(base)));
}

module.exports = Tournament;
