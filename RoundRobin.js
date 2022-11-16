"use strict";

const War = require('./war.js');
const Player = require('./Player.js');

/**
 *  Create object to run a round robin season schedule and game results
 *  See here for more details on round-robin tournaments:
 *  https://en.wikipedia.org/wiki/Round-robin_tournament
 */
function RoundRobin( players ) {
	this.roster = players;
	this.schedule = [];
}

/**
 *  Round-robin
 */
RoundRobin.prototype.play = function () {
	const numberOfPlayers = this.roster.length;
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

			const gameID = this.schedule.length;

			this.schedule.push({
				id: gameID,
				week: week,
				player1: this.roster[playerOneIndex].fullName,
				player2: this.roster[playerTwoIndex].fullName,
				winner: winner,
				hands: game.hands
			});

			this.roster[playerOneIndex].games.push({
				id: gameID,
				opponent: this.roster[playerTwoIndex].fullName,
				win: winner == playerOneIndex,
			});

			this.roster[playerTwoIndex].games.push({
				id: gameID,
				opponent: this.roster[playerOneIndex].fullName,
				win: winner == playerTwoIndex
			});

			this.roster[winner].wins += 1;
		}
		slots.splice(1, 0, slots.pop())
	}

	this.ratePlayers();
}

/**
 *  Rate players based on number of wins,
 *  Wins are adjusted for game length (longer games are worth less)
 */
RoundRobin.prototype.ratePlayers = function () {
	const maxNumberOfRounds = this.schedule.reduce( (max, game) => { return Math.max(max, game.hands.length)}, 0);

	for( let i = 0; i < this.roster.length; i++ ){
		const rating = this.roster[i].games.filter( game => {
			return game.win;
		}).reduce( (total, game) => {
			const gameObject = this.schedule[game.id];
			let gameRating = (3 - gameObject.hands.length / maxNumberOfRounds) / 3;
			return total + gameRating;
		}, 0);
		this.roster[i].rating = rating;
	}
}

module.exports = RoundRobin;
