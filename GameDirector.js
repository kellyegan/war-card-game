"use strict";
const CardDeck = require("./CardDeck");
const PlayByPlay = require("./PlayByPlay.js");

class GameDirector {
  constructor(game) {
    this.game = game;
    this.players = game.players;
    this.hands = game.hands;
    this.winner = game.winner;

    const deck = new CardDeck.Deck();
    this.pbp = new PlayByPlay(this.game, deck);
  }

  getCommentary() {
    
    return this.pbp.create();
  }
}

module.exports = GameDirector;
