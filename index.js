"use strict";

const War = require('./war.js');
const RoundRobin = require('./round-robin.js');

let season = new RoundRobin(32);
season.play();


console.log(season.rankPlayers());



// console.log( season.schedule.filter(game => game.winner === 9).length )
