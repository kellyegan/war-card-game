"use strict";

const War = require('./war.js');
let gameLengths = []

let game = new War(3, 1);
game.deal();

const winner = game.play();


game.rounds.forEach( (round, index) => {
	console.log(index, round);
});

console.log("Winner:", winner)
