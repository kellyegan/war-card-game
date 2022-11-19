"use strict";
const CardDeck = require("./CardDeck");
const PlayByPlay = require("./PlayByPlay.js");

class GameDirector {
  constructor(game) {
    this.game = game;

    const deck = new CardDeck.Deck();
    this.pbp = new PlayByPlay(this.game, deck);
  }

  
  getCommentary() {
    let text = [];
    text.push(this.pbp.getIntro());

    for( let comment of this.pbp.getCall()) {
      text.push(comment);
    }

    text.push(this.pbp.getConclusion());

    return text;
  }
}

module.exports = GameDirector;
