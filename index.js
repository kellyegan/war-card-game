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

//Generate commentary
const pbp = new PlayByPlay(tournament.games[0])
let calls = pbp.create()

for( let call of calls) {
	console.log(call);
}

const writer = fs.createWriteStream("./output/commentary.txt");
calls.forEach( call => writer.write(call + "\n\n") );
writer.on('finish', () => console.log("Commentary saved."))

// writeFile("./output/season.json", seasonJSON, 'utf8')
// 	.then( () => {
// 		console.log(`Saved "./output/season.json"`);
// 	}).catch ( (error) => {
// 		console.error(error);
// 	})
