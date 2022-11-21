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

  getIntro() {
    let intro = "";
    intro += `Welcome to the Game ${this.game.match} of the ${this.ordinal(this.game.round)} round of the War Championships. `;
    intro += `Today's players are ${this.game.players[0].fullName} and ${this.game.players[1].fullName}.`
    return intro;
  }

  getCommentary() {
    let colorComments = this.color.getCall();

    this.clearText();
    this.addComment(this.hosts.color, `What a beautiful day for war.`);
    this.addComment(this.hosts.main, `Hello, I'm ${this.hosts.main.fullName}.`);
    this.addComment(this.hosts.color, `Hello, I'm ${this.hosts.color.fullName}.`);

    this.addComment(this.hosts.main, this.getIntro());

    this.addComment(this.hosts.color, "When these two players last met #winner# beat #loser# pretty soundly. Will they repeat that performance again today?")

    
    
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

  /* So succinct. Here i sthe source: https://leancrew.com/all-this/2020/06/ordinal-numerals-and-javascript/ */ 
  ordinal(n) {
    var s = ["th", "st", "nd", "rd"];
    var v = n%100;
    return n + (s[(v-20)%10] || s[v] || s[0]);
  }
  

}

module.exports = GameDirector;
