"use strict";

const fs = require('fs');

const RoundRobin = require('./RoundRobin.js');
const Tournament = require('./Tournament.js');
const GameDirector = require('./GameDirector.js');
const Player = require('./Player.js');
const Person = require('./Person.js');

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
const regularSeasonStats = season.compileStats();

//Play the tournament
const tournament = new Tournament(season.roster, 16);
tournament.play();

let words = 0;
const writer = fs.createWriteStream("./output/commentary.md");

tournament.games.forEach( (game, index) => {
	writer.write(`## Round ${game.round}, Match ${game.match}\n\n`);

	const gameDirector = new GameDirector(game, hosts);
	const commentary = gameDirector.getCommentary();
	
	
	commentary.forEach( comment => {
		writer.write(comment + "\n\n");
		words += countWords(comment);
	});
});

writer.end();
writer.on('finish', () => console.log(`Saved. ${words} words.`))

function countWords(str) {
	return str.trim().split(/\s+/).length;
}