"use strict";

const tracery = require("tracery-grammar");

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
    this.grammar = this.getGrammar();

    this.text = []
  }

  getGrammar() {
    const rules = {
      whenWeLastMet: [
        "When these players last met,",
        "In their match in the regular season,",
        "Last time these players sat across from each other,",
        "In the regular season, ",
      ]
    };
    const grammar = tracery.createGrammar(rules);
    grammar.addModifiers(tracery.baseEngModifiers);
    return grammar;
  }


  addIntro() {
    //Get their regular season game
    const lastMeeting = this.game.players[0].games.filter( game => game.opponent == this.game.players[1].fullName)[0]

    const winner = lastMeeting.win ? this.game.players[0] : this.game.players[1];
    const loser = lastMeeting.win ? this.game.players[1] : this.game.players[0];

    this.addComment(this.hosts.color, `What a beautiful day for war.`);
    this.addComment(this.hosts.main, `Hello, I'm ${this.hosts.main.fullName}.`);
    this.addComment(this.hosts.color, `And I am ${this.hosts.color.fullName}.`);

    let intro = "";
    intro += `Welcome to Game ${this.game.match} of the ${this.ordinal(this.game.round)} round of the War Championships. `;
    intro += `Today's players are ${this.game.players[0].fullName} and ${this.game.players[1].fullName}. `
    intro += `When these two players last met ${winner.lastName} beat ${loser.lastName}. Will they repeat that performance again today ${this.hosts.color.firstName}?`
    this.addComment(this.hosts.main, intro);

    this.addComment(this.hosts.color, `Its hard to tell ${this.hosts.main.firstName}, something something something`);
  }

  getCommentary() {
    let colorComments = this.color.getCall();

    this.clearText();

    this.addIntro()
    
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
    if(comment.trim() !== "") {
      this.text.push(`**${speaker.lastName.toUpperCase()}:** ${comment}`);
    }
  }

  /* So succinct. Here i sthe source: https://leancrew.com/all-this/2020/06/ordinal-numerals-and-javascript/ */ 
  ordinal(n) {
    var s = ["th", "st", "nd", "rd"];
    var v = n%100;
    return n + (s[(v-20)%10] || s[v] || s[0]);
  }
  

}

module.exports = GameDirector;
