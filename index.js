const War = require('./war.js');

let game = new War();
game.deal();
for(let i = 0; i < 20; i++) {
	game.playRound();
}
