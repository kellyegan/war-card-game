"use strict";

const fs = require('fs');

const RoundRobin = require('./RoundRobin.js');
const Tournament = require('./Tournament.js');
const GameDirector = require('./GameDirector.js');
const Player = require('./Player.js');
const Person = require('./Person.js');
const Stats = require('./Stats');

// const writeFile = util.promisify(fs.writeFile);

//Create a roster of players
const players = [];

for(let i = 0; i < 31; i++) {
	players.push(new Player(i));
}

//Create announcers
const hosts = {
	main: new Person(),
	color: new Person()
}

//Play the regular season
const season = new RoundRobin(players);
season.play();

const transitions = Stats.getLeaderTransistions(season.schedule[0].hands);

const seasonStats = Stats.getSeriesStats(season.schedule);


//Play the tournament
const tournament = new Tournament(season.roster, 16);
tournament.play();

let words = 0;
const writer = fs.createWriteStream("./output/commentary.md");
let previousGames = [];

writer.write("# Transcript of the Tournament of War, the card game.\n\n");

tournament.games.forEach( (game, index) => {
	const gameDirector = new GameDirector(game, hosts, previousGames);
	const commentary = gameDirector.getCommentary();
	
	commentary.forEach( comment => {
		writer.write(comment + "\n\n");
		words += countWords(comment);
	});

	previousGames.push(game);
});

writer.end();
writer.on('finish', () => console.log(`Saved. ${words} words.`))

function countWords(str) {
	return str.trim().split(/\s+/).length;
}