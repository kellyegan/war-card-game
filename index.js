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

const writeFile = util.promisify(fs.writeFile);

//Create a roster of players
const players = [];

for(let i = 0; i < 31; i++) {
	players.push(new Player(i));
}

//Play the regular season
const season = new RoundRobin(players);
season.play();

const seasonJSON = JSON.stringify(season, null, 2);

writeFile("./output/season.json", seasonJSON, 'utf8')
	.then( () => {
		console.log(`Saved "./output/season.json"`);
	}).catch ( (error) => {
		console.error(error);
	})

//Play the tournament
const tournament = new Tournament(season.roster, 16);
tournament.play();

const tournamentJSON = JSON.stringify(tournament, null, 2);

writeFile("./output/tournament.json", tournamentJSON, 'utf8')
	.then( () => {
		console.log(`Saved "./output/tournament.json"`);
	}).catch ( (error) => {
		console.error(error);
	})

const pbp = new PlayByPlay(tournament.games[0])
let calls = pbp.generate()

for( let call of calls) {
	console.log(call);
}
 