"use strict";

const War = require('./war.js');

/**
 *  Create object to run a round robin season schedule and game results
 *  See here for more details on round-robin tournaments:
 *  https://en.wikipedia.org/wiki/Round-robin_tournament
 */
function RoundRobin( numberOfPlayers ) {
	this.players = [];
	this.schedule = [];

	for( let i = 0; i < numberOfPlayers; i++) {
		this.players.push( new Player(i) );
	}
}

/**
 *  Round-robin
 */
RoundRobin.prototype.play = function () {
	const numberOfPlayers = this.players.length;
	const evenTeams = numberOfPlayers % 2 == 0;

	//Extra slot needed when there is an odd number of teams
	const numberOfSlots = evenTeams ? numberOfPlayers : numberOfPlayers + 1;

	let slots = [];
	for( let i = 0; i < numberOfSlots; i++ ) {
		//First slot is for blank slot, competitor gets a bye
		let value = evenTeams ? i : i - 1;
		slots.push(value)
	}

	//Ignore the first game of every week its a bye
	let start = evenTeams ? 0 : 1;

	for(let week = 0; week < slots.length - 1; week++) {
		for(let i = start; i < slots.length/2; i++) {

			const playerOneIndex = slots[i];
			const playerTwoIndex = slots[ slots.length - (1 + i) ];

			const game = new War(2, 1);
			game.deal();

			const winner = game.play() == 0 ? playerOneIndex : playerTwoIndex;
			const numberOfHands = game.hands.length;

			const gameID = this.schedule.length;

			this.schedule.push({
				id: gameID,
				week: week,
				player1: playerOneIndex,
				player2: playerTwoIndex,
				winner: winner,
				hands: game.hands
			});

			this.players[playerOneIndex].games.push({
				week: week,
				gameID: gameID,
				opponent: playerTwoIndex,
				numberOfRounds: numberOfHands,
				win: winner == playerOneIndex,
			});

			this.players[playerTwoIndex].games.push({
				week: week,
				gameID: gameID,
				opponent: playerOneIndex,
				numberOfRounds: numberOfHands,
				win: winner == playerTwoIndex
			});

			this.players[winner].wins += 1;
		}
		slots.splice(1, 0, slots.pop())
	}

	return this.schedule;
}

function Player(id) {
	this.id = id,
	this.games = [];
	this.wins = 0;
}

module.exports = RoundRobin;
