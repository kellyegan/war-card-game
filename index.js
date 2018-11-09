"use strict";

const War = require('./war.js');
const RoundRobin = require('./round-robin.js');

let season = new RoundRobin(30);
season.play();

//season.schedule.forEach((game) => {
//	season.players[game.winner].wins++;
//})

season.players.forEach( player => {
	console.log(player);
})

season.schedule.forEach( game => {
	console.log(`${game.id} winner: ${game.winner} rounds: ${game.rounds.length}`);
})


console.log( season.schedule.filter(game => game.winner === 9).length )
