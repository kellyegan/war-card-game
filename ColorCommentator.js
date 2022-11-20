"use strict";
const tracery = require("tracery-grammar");
const CardDeck = require("./CardDeck");

class ColorCommentator {
  constructor(game, deck) {
    this.players = game.players;
    this.hands = game.hands;
    this.winner = game.winner;
    this.deck = deck;
    this.grammar = this.getGrammar();
  }

  getGrammar() {
    const rules = {
      bigPrize: [
        "That's a big prize for #winner#. #regret#",
        "A lot of cards in that play.",
        "#prize# cards is nothing to sneeze at.",
        "What's #winner# going to do with all those cards.",
      ],
      regret: [
        "I bet #loser# wishes they played that differently.",
        "#loser#'s going to lose sleep over that one tonight.",
        "I suspect #loser#'s kicking themselves over that one.",
        "#loser# is going to regret that one.",
      ],
      momentum: [
        "#winner# is looking good.",
        "#winner# has got some momentum.",
        "#winner# might be making a move.",
        "I think #winner# is going somewhere.",
        "Is #winner# going to take this somewhere?",
        "#loser# is going to be playing catch up if they don't stop this.",
        "#loser# is stumbling a little.",
        "#loser# should nip this run in the bud.",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
      ],
      streak: [
        "What a streak for #winner#.",
        "#winner# is on fire.",
        "#winner# ate their Wheaties today.",
        "Is #loser# awake?",
        "Someone should tell #loser# the match isn't over.",
        "#loser# is really taking a beating.",
        "I think #winner# has decided they want this more than #loser#.",
        "I think #loser# should try some higher value cards.",
        "",
      ],
      streakBroken: [
        "#winner# might still have some fight in them.",
        "There's #winner#.",
        "#winner#'s back in it.",
        "#winner# finally get's a punch in.",
        "#winner# might have stopped the bleeding.",
        "That's a start for #winner#.",
        "What a run for #loser#. #winner# has some ground to make up.",
      ],
      slugfest: [
        "These two are really slugging it out.",
        "They are really going toe to toe in this game.",
        "#winner# and #loser# are trading punch for punch.",
        "We have some real fighters on our hands.",
        "What a fight!",
        "",
        "",
        "",
        "",
      ],
      couldendsoon: [
        "It's getting close folks.",
        "In just a few plays we could have a result.",
        "It's getting tight. #leader# must be feeling good.",
        "#leader# likes where this is going.",
        "We're almost there.",
        "",
        "",
        "",
        "",
      ],
      endIsNye: [
        "This could be it folks.",
        "The game could end in this play.",
        "This could be it.",
        "It all rests on this play.",
        "Game point folks.",
        "#leader# could end it here.",
        "#leader# almost has it sewed up.",
        "",
        "",
      ],
      overpaid: [
        "#winner# over paid for that #losingCardRank#.",
        "#winner# probably didn't need to use #winningCardRank.a# in that play.",
        "I hope #winner# doesn't need that #winningCardRank# when something bigger comes along.",
        "That #winningCardRank# seems wasted on #losingCardRank#.",
        "",
        "",
        "",
        "",
        "",
      ],
      wellPlayed: [
        "Well played by #winner#.",
        "Nice play by #winner#.",
        "Great use of #winningCardRank.a# by #winner#.",
        "Nice play.",
        "Nice!",
        "#winner# just showed us how to play.",
        "Well done.",
        "Good job by #winner#.",
        "",
        "",
        "",
        "",
        "",
      ]
    };
    const grammar = tracery.createGrammar(rules);
    grammar.addModifiers(tracery.baseEngModifiers);
    return grammar;
  }

  createComment(origin, handDetails) {
    let rules = `[winner:${handDetails.winner.lastName}]`;
    rules += `[leader:${this.players[handDetails.leader].lastName}]`;
    rules += `[loser:${handDetails.loser.lastName}]`;
    rules += `[winningCardName:${handDetails.winningCard.name}]`;
    rules += `[winningCardRank:${handDetails.winningCard.rank.toLowerCase()}]`;
    rules += `[losingCardName:${handDetails.losingCard.name}]`;
    rules += `[losingCardRank:${handDetails.losingCard.rank.toLowerCase()}]`;
    rules += `[prize:${handDetails.prize}]`;
    rules += origin;
    return this.grammar.flatten(rules) + " ";
  }

  parseHand(hand) {
    let details = {};
    details.war = hand.war;
    details.prize = hand.prize;

    details.leader = hand.counts[0] > hand.counts[1] ? 0 : 1;

    if (hand.counts[0] === 0) {
      details.gameover = true;
      details.winner = this.players[1];
      details.loser = this.players[0];
    }

    if (hand.counts[1] === 0) {
      details.gameover = true;
      details.winner = this.players[0];
      details.loser = this.players[1];
    }

    if (hand.winners.length == 1) {
      details.tie = false;
      const winnerIndex = hand.winners[0];
      const loserIndex = (hand.winners[0] + 1) % 2;

      details.winner = this.players[winnerIndex];
      details.loser = this.players[loserIndex];

      if (hand.play.length > 1) {
        details.winningCard = this.deck.getCard(
          hand.play[winnerIndex].identifier
        );
        details.losingCard = this.deck.getCard(
          hand.play[loserIndex].identifier
        );
      } else {
        details.winningCard = this.deck.getCard(hand.play[0].identifier);
      }
    } else {
      details.tie = true;
      details.rank = this.deck.getRank(hand.play[0].identifier);
    }

    return details;
  }

  getIntro() {
    return `Looks like ${this.players[0].fullName} and ${this.players[1].fullName} are ready to start.`;
  }

  *getCall() {
    let spreadAtLastUpdate = 0;
    let streak = 0;
    let previousStreaks = [];
    let lastWinner = null;
    let leader = null;
    let lastLeader = null;
    let lastLeadChange;

    for (let i = 0; i < this.hands.length; i++) {
      let hand = this.hands[i];
      let handDetails = this.parseHand(hand);
      let call = "";

      //Track winning streak
      streak = lastWinner === handDetails.winner ? streak + 1 : 0;
      let longStreakBroken =
        streak - previousStreaks[previousStreaks.length - 1] < -5;
      previousStreaks.push(streak);
      let maxPreviousStreaks = Math.max(...previousStreaks);
      lastWinner = handDetails.winner;

      //Track change in who leads
      leader = hand.counts[0] > hand.counts[1] ? 0 : 1;
      if (leader !== lastLeader) {
        //Leader changed
        lastLeadChange = i;
      }
      lastLeader = leader;

      if (!handDetails.gameover) {
        if (!handDetails.tie) {
          if ( handDetails.winningCard.value - handDetails.losingCard.value < 3 ) {
            call += this.createComment("#wellPlayed#", handDetails);
          }

          if (streak >= 3 && streak < 5) {
            call += this.createComment("#momentum#", handDetails);
          }

          if (streak >= 5) {
            call += this.createComment("#streak#", handDetails);
          }

          if (longStreakBroken) {
            call += this.createComment("#streakBroken#", handDetails);
          }

          if (maxPreviousStreaks < 2 && previousStreaks.length >= 10) {
            call += this.createComment("#slugfest#", handDetails);
            previousStreaks = [];
          }

          if (handDetails.war) {
            if (handDetails.prize > 6) {
              call += this.createComment("#bigPrize#", handDetails);
            }
          } else {
            if ( handDetails.winningCard.value - handDetails.losingCard.value > 8 && call == "") {
              call += this.createComment("#overpaid#", handDetails);
            }
          }

          if (hand.counts[0] < 5 || hand.counts[1] < 6) {
            call += this.grammar.flatten("#couldendsoon#");
          }

          if (hand.counts[0] < 2 || hand.counts[1] <= 2) {
            call += this.grammar.flatten("#endIsNye#");
          }

          if (hand.counts[0] < 5 || hand.counts[1] > 10 && i >) {
            call += this.grammar.flatten("#couldendsoon#");
          }
        }
      }

      if (previousStreaks.length > 10) {
        previousStreaks.shift();
      }
      yield call.trim();
    }
  }

  getConclusion() {
    return `${this.winner} wins in ${this.hands.length < 150 ? "just " : ""}${this.hands.length} hands.`;
  }
}

module.exports = ColorCommentator;
