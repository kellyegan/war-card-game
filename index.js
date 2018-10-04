"use strict";

const War = require('./war.js');
let gameLengths = []

let game = new War(3, 1);
game.deal();
gameLengths.push(game.play());

game.rounds.forEach( (round, index) => {
	console.log(index, round);
});
