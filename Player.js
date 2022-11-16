"use strict";

const Person = require("./Person");

class Player extends Person{
	constructor(id) {
		super();
		this.id = id;
		this.games = [];
		this.finals = [];
		this.wins = 0;
		this.rating = 0;
	}
}

module.exports = Player;
