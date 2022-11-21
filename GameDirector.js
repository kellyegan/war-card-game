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
        "#lastMeeting.capitalize#, #previousWinner# #beat# #previousLoser#. #repeatPerformanceQuestion#, ",
        "#previousWinner# #beat# #previousLoser# #lastMeeting#. #repeatPerformanceQuestion#, "
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
        "I'm sure #previousWinner# would love to repeat that game, but #baselessSpeculation#.",
        "I'm sure #previousLoser# is looking for a change in results, but #baselessSpeculation#.",
        "#previousLoser# is definitely ready for a rematch, but #baselessSpeculation#.",
        "#baselessSpeculation.capitalize#."
      ],
      baselessSpeculation: [
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

  createComment(origin, gameDetails) {
    let rules = `[playerOneFullName:${gameDetails.winner.lastName}]`;
    rules += `[playerTwoFullName:${gameDetails.loser.lastName}]`;
    rules += `[playerOneLastName:${gameDetails.winningCard.name}]`;
    rules += `[playerTwoLastName:${gameDetails.winningCard.rank.toLowerCase()}]`;
    rules += `[previousWinner:${gameDetails.losingCard.name}]`;
    rules += `[previousLoser:${gameDetails.losingCard.rank.toLowerCase()}]`;
    rules += origin;
    return this.grammar.flatten(rules);
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

    this.grammar.pushRules("playerOne", this.game.players[0].fullName);
    this.grammar.pushRules("playerTwo", this.game.players[1].fullName);
    intro += this.grammar.flatten(`#playerIntro# `);

    //Last time the players met
    this.grammar.pushRules("previousWinner", winner.lastName);
    this.grammar.pushRules("previousLoser", loser.lastName);
    intro += this.grammar.flatten(`#whenWeLastMet#`);
    intro += this.hosts.color.firstName + "?";
    this.addComment(this.hosts.main, intro);

    let response = "";
    this.grammar.pushRules("mainHost", this.hosts.main.firstName);
    response += this.grammar.flatten(`#repeatPerformanceAnswer#`);
    this.addComment(this.hosts.color, response);
  }

  getCommentary() {
    let colorComments = this.color.getCall();

    this.clearText();

    this.addIntro()
    
    let parameters = `[playerOne:${this.game.players[0].lastName}][playerTwo:${this.game.players[1].lastName}]`;
    let currentPlayByPlay = this.grammar.flatten(parameters + "#playersReady#");

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
