"use strict";
const CardDeck = require("./CardDeck");
const PlayByPlay = require("./PlayByPlay.js");

class GameDirector {
  constructor(game, hosts) {
    this.game = game;
    this.hosts = hosts;

    const deck = new CardDeck.Deck();
    this.pbp = new PlayByPlay(this.game, deck);
  }

  getCommentary() {
    let text = [];
    text.push(this.pbp.getIntro());

    for( let comment of this.pbp.getCall()) {
      text.push(`**${this.hosts.main.lastName.toUpperCase()}:** ${comment}`);
      text.push(`**${this.hosts.color.lastName.toUpperCase()}:** So many colors!`);
    }

    text.push(this.pbp.getConclusion());

    return text;
  }
}

module.exports = GameDirector;
