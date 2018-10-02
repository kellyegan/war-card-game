const War = require('./war.js');
let gameLengths = []

for(let i = 0; i < 10000; i++) {
	let game = new War();
	game.deal();
	gameLengths.push(game.play());
}

let reachedMax = gameLengths.filter( length => length >= 10000 );
let max = gameLengths.reduce((max, current) => {return Math.max(max, current)});
let min = gameLengths.reduce((max, current) => {return Math.min(max, current)});

let sum = gameLengths.reduce((total, current) => {return total + current});
console.log("Mean: " + sum/gameLengths.length);
console.log("Max: " + max);
console.log("Min: " + min);
console.log("Reached max: " + reachedMax.length/gameLengths.length)
