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
      welcome: [
        "Welcome to Game #gameNumber# of the #roundOrdinal# round of the War Championships."
      ],
      playerIntro: [
        "Today's players are #playerOne# and #playerTwo#.",
        "Today's competitors are #playerOne# and #playerTwo#.",
        "At the table today, #playerOne# and #playerTwo#.",
        "We are about to watch #playerOne# and #playerTwo# compete.",
        "This game will pit #playerOne# against #playerTwo#.",
        "Our competitors today: #playerOne# and #playerTwo#.",
        "Our players today: #playerOne# and #playerTwo#.",
        "#playerOne# and #playerTwo# will go head to head in today's match.",
        "On one side of the table today, #playerOne#. On the other, #playerTwo#.",
        "Either #playerOne# or #playerTwo# will emerge from this match a winner."
      ],
      whenWeLastMet: [
        "#lastMeeting.capitalize#, #winner# #beat# #loser#. #repeatPerformanceQuestion#, ",
        "#winner# #beat# #loser# #lastMeeting#. #repeatPerformanceQuestion#, "
      ],
      beat: [ "beat", "defeated", "beat", "defeated", "bested", "triumphed over"],
      lastMeeting: [
        "when these players last #met#",
        "the last time these players #met#",
        "in their match in the regular season",
        "in their last meeting",
        "in their last match",
        "in their last game",
        "in the regular season"
      ],
      met: [
        "met",
        "sat across from each other",
        "sat at the table together",
        "played",
        "competed",
        "battled"
      ],
      repeatPerformanceQuestion: [
        "What are we in for today",
        "What happens today",
        "Who will win today",
        "What happens now",
        "What can we expect from them today",
        "Can we expect the same",
        "Will they repeat that performance again today",
        "What's next"
      ],
      repeatPerformanceAnswer: [
        "I'm sure #winner# would love to repeat that game, but #equivocationPlusHost#.",
        "I'm sure #loser# is looking for a change in results, but #equivocationPlusHost#.",
        "#loser# is definitely ready for a rematch, but #equivocationPlusHost#.",
        "#equivocationPlusHost.capitalize#."
      ],
      equivocationPlusHost: [
        "#equivocation#, #mainHost#",
        "as you know #mainHost#, #equivocation#"
      ],
      equivocation: [
        "it's hard to tell",
        "you never know what to expect",
        "it could go either way",
        "they're both strong players",
        "its all in the cards",
        "there is always a possibility it could go either way",
        "its really anyone's game",
        "there is no way to know",
        "things can change in a single hand"
      ],
      shutout: [
        "That game was a shutout. #winner# maintained the lead the whole game.",
      ],
      winnerDominated: [
        "#winner# dominated.",
        "#loser# really didn't have a chance in that match.",
        "#winner# held the lead for most of the game.",
        "#winner# kept the lead for most of the match.",
      ],
      winnerLead: [
        "#winner# lead for most of the game.",
        "#loser# never really made a move in that game."
      ],
      tossUp: [
        "That game was a pretty even match.",
        "Neither #winner# or #loser# really dominated in that game."
      ],
      loserSlightLead: [
        "Despite losing, #loser# lead for more hands than #winner#."
      ],
      loserLead: [
        "#loser# really dominated in that game, but couldn't turn it into a win."
      ],
      playersReady: [
        "#players.capitalize# are ready. Here we go.",
        "The cards are dealt and #players# are seated. Let's begin.",
        "The dealer has signaled the start of the match.",
        "It looks like #players# are about to start.",
        "#players# are ready to play the first hand."
      ],
      players: [
        "the players",
        "#playerOne# and #playerTwo#",
        "the competitors"
      ]
      
    };
    const grammar = tracery.createGrammar(rules);
    grammar.addModifiers(tracery.baseEngModifiers);
    return grammar;
  }

  addIntro() {
    //Get their regular season game
    const lastGame = this.game.players[0].games.filter( game => game.opponent == this.game.players[1].fullName)[0]
    
    const previousWinner = lastGame.win ? this.game.players[0] : this.game.players[1];
    const previousLoser = lastGame.win ? this.game.players[1] : this.game.players[0];
    
    const winnerHands = lastGame.win ? lastGame.playerHands : lastGame.opponentHands;
    const loserHands = lastGame.win ? lastGame.opponentHands : lastGame.playerHands;

    const lastGameHandRatio = loserHands / winnerHands;

    this.addComment(this.hosts.color, `What a beautiful day for war.`);
    this.addComment(this.hosts.main, `Hello, I'm ${this.hosts.main.fullName}.`);
    this.addComment(this.hosts.color, `And I am ${this.hosts.color.fullName}.`);

    let intro = "";
    intro += `Welcome to Game ${this.game.match} of the ${this.ordinal(this.game.round)} round of the War Championships. `;

    this.grammar.pushRules("playerOne", this.game.players[0].fullName);
    this.grammar.pushRules("playerTwo", this.game.players[1].fullName);
    intro += this.grammar.flatten(`#playerIntro# `);

    //Last time the players met
    this.grammar.pushRules("mainHost", this.hosts.main.firstName);
    this.grammar.pushRules("winner", this.game.players[0].lastName);
    this.grammar.pushRules("loser", this.game.players[1].lastName);
    
    intro += this.grammar.flatten(`#whenWeLastMet#`);
    intro += this.hosts.color.firstName + "?";
    this.addComment(this.hosts.main, intro);

    let response = "";

    if( lastGameHandRatio === 0) {
      response += this.grammar.flatten(`#shutout# `);
    } else if( lastGameHandRatio < 0.5 ) {
      response += this.grammar.flatten(`#winnerDominated# `);
    } else if( lastGameHandRatio < 0.8 ) {
      response += this.grammar.flatten(`#winnerLead# `);
    } else if( lastGameHandRatio < 1.0) {
      response += this.grammar.flatten(`#tossUp# `);
    } else if( lastGameHandRatio < 1.5) {
      response += this.grammar.flatten(`#loserSlightLead# `);
    } else {
      response += this.grammar.flatten(`#loserLead# `);
    }

    response += this.grammar.flatten(`#repeatPerformanceAnswer#`);
    this.addComment(this.hosts.color, response);
  }

  getCommentary() {
    let colorComments = this.color.getCall();

    this.clearText();
    this.addIntro()
    
    this.grammar.pushRules("playerOne", this.game.players[0].lastName);
    this.grammar.pushRules("playerTwo", this.game.players[1].lastName);
    let currentPlayByPlay = this.grammar.flatten("#playersReady#");

    // for( let comment of this.pbp.getCall()) {
    //   currentPlayByPlay += ` ${comment}`;

    //   let colorComment = colorComments.next().value;

    //   if(colorComment !== "") {
    //     this.addComment(this.hosts.main, currentPlayByPlay);
    //     currentPlayByPlay = "";
    //     this.addComment(this.hosts.color, colorComment);
    //   }  
    // }

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
