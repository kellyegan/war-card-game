"use strict";
const CardDeck = require("./CardDeck");
const PlayByPlay = require("./PlayByPlay.js");

class GameDirector {
  constructor(game, announcers) {
    this.game = game;
    this.announcers = announcers;

    const deck = new CardDeck.Deck();
    this.pbp = new PlayByPlay(this.game, deck);
  }

  getCommentary() {
    let text = [];
    text.push(this.pbp.getIntro());

    for( let comment of this.pbp.getCall()) {
      text.push(`**${this.announcers.mainCommentator.lastName.toUpperCase()}:** ${comment}`);
      text.push(`**${this.announcers.colorCommentator.lastName.toUpperCase()}:** So many colors!`);
    }

    text.push(this.pbp.getConclusion());

    return text;
  }
}

module.exports = GameDirector;
