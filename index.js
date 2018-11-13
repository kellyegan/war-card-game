"use strict";

const War = require('./War.js');
const RoundRobin = require('./RoundRobin.js');
const Tournament = require('./Tournament.js');

const season = new RoundRobin(32);
season.play();
const postSeasonPlayers = season.topPlayers(16);

const tournament = new Tournament(postSeasonPlayers);
tournament.play();

// console.log( season.schedule.filter(game => game.winner === 9).length )
