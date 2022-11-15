"use strict";

const fs = require('fs');
const util = require('util');

const War = require('./War.js');
const RoundRobin = require('./RoundRobin.js');
const Tournament = require('./Tournament.js');
const PlayByPlay = require('./PlayByPlay.js');

const writeFile = util.promisify(fs.writeFile);

//Play the regular season
const season = new RoundRobin(32);
season.play();

const seasonJSON = JSON.stringify(season, null, 2);

writeFile("./season.json", seasonJSON, 'utf8')
	.then( () => {
		console.log(`Saved "./season.json"`);
	}).catch ( (error) => {
		console.error(error);
	})

//Play the tournament
const tournament = new Tournament(season.players, 16);
tournament.play();

const tournamentJSON = JSON.stringify(tournament, null, 2);

writeFile("./tournament.json", tournamentJSON, 'utf8')
	.then( () => {
		console.log(`Saved "./tournament.json"`);
	}).catch ( (error) => {
		console.error(error);
	})

const pbp = new PlayByPlay(tournament.games[0])
let calls = pbp.generate()

for( let call of calls ) {
	console.log(call);
}
