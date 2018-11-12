"use strict";

const War = require('./war.js');
const RoundRobin = require('./round-robin.js');
const Tournament = require('./tournament.js');

const season = new RoundRobin(32);
season.play();

const postSeasonPlayers = season.players.slice(0, 5);

const tournament = new Tournament(postSeasonPlayers);


// console.log( season.schedule.filter(game => game.winner === 9).length )
