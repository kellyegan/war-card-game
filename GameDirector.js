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
  }

  getCommentary() {
    let text = [];
    let colorComments = this.color.getCall();
    
    text.push(this.pbp.getIntro());
    let currentPlayByPlay = `**${this.hosts.main.lastName.toUpperCase()}:**`;
    for( let comment of this.pbp.getCall()) {
      currentPlayByPlay += ` ${comment}`;

      let colorComment = colorComments.next().value;
      if(colorComment !== "") {
        text.push(currentPlayByPlay);
        currentPlayByPlay = `**${this.hosts.main.lastName.toUpperCase()}:**`;
        text.push(`**${this.hosts.color.lastName.toUpperCase()}:** ${colorComment}`);
      }  
    }

    text.push(this.pbp.getConclusion());

    return text;
  }
}

module.exports = GameDirector;
