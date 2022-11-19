"use strict";

const fs = require('fs');
const util = require('util');

const War = require('./War.js');
const Person = require("./Person.js");
const RoundRobin = require('./RoundRobin.js');
const Tournament = require('./Tournament.js');
const PlayByPlay = require('./PlayByPlay.js');
const Player = require('./Player.js');
const CardDeck = require('./CardDeck');

let deck = new CardDeck.Deck();

// const writeFile = util.promisify(fs.writeFile);

//Create a roster of players
const players = [];

for(let i = 0; i < 31; i++) {
	players.push(new Player(i));
}

//Play the regular season
const season = new RoundRobin(players);
season.play();

//Play the tournament
const tournament = new Tournament(season.roster, 16);
tournament.play();

let words = 0;
const writer = fs.createWriteStream("./output/commentary.txt");

tournament.games.forEach( (game, index) => {
	writer.write(`## Round ${game.round}, Match ${game.match}\n\n`);

	const pbp = new PlayByPlay(game, deck);
	let calls = pbp.create()
	
	calls.forEach( call => {
		writer.write(call + "\n\n");
		words += countWords(call);
	});
});

writer.end();
writer.on('finish', () => console.log(`Saved. ${words} words.`))

function countWords(str) {
	return str.trim().split(/\s+/).length;
}