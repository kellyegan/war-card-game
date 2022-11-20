"use strict";
const CardDeck = require("./CardDeck");
const PlayByPlay = require("./PlayByPlay.js");
const ColorCommentator = require("./ColorCommentator.js");

class GameDirector {
  constructor(game, hosts) {
    this.game = game;
    this.hosts = hosts;

    const deck = new CardDeck.Deck();
    this.pbp = new PlayByPlay(this.game, deck);
    this.color = new ColorCommentator(this.game, deck);

    this.text = []
  }

  getCommentary() {
    let colorComments = this.color.getCall();

    this.clearText();

    this.addComment(this.hosts.main, this.pbp.getIntro());
    let currentPlayByPlay = "";

    for( let comment of this.pbp.getCall()) {
      currentPlayByPlay += ` ${comment}`;

      let colorComment = colorComments.next().value;

      if(colorComment !== "") {
        this.addComment(this.hosts.main, currentPlayByPlay);
        currentPlayByPlay = "";
        this.addComment(this.hosts.color, colorComment);
      }  
    }

    this.addComment(this.hosts.main, this.pbp.getConclusion());

    return this.text;
  }

  clearText() {
    this.text = [];
  }

  addComment( speaker, comment ) {
    this.text.push(`**${speaker.lastName.toUpperCase()}:** ${comment}`);
  }

}

module.exports = GameDirector;
