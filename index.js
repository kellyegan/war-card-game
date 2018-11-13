"use strict";

const War = require('./war.js');
const RoundRobin = require('./round-robin.js');
const Tournament = require('./tournament.js');

const season = new RoundRobin(32);
season.play();
const postSeasonPlayers = season.topPlayers(16);

const tournament = new Tournament(postSeasonPlayers);
tournament.play();

// console.log( season.schedule.filter(game => game.winner === 9).length )
