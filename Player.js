"use strict";

function Player(id, person) {
	this.id = id,
	this.person = person;
	this.games = [];
	this.finals = [];
	this.wins = 0;
	this.rating = 0;
}

module.exports = Player;
