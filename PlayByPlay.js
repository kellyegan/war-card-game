"use strict";
const tracery = require("tracery-grammar");
const CardDeck = require("./CardDeck")

class PlayByPlay {
    constructor( game ) {
        this.players = game.players;
        this.hands = game.hands;
        this.winner = game.winner;
        this.deck = new CardDeck.Deck();
        this.grammar = this.getGrammar();
    }

    getGrammar() {
        const rules = {
            call: [
                "#winner# #beats# #loser# with #winning_card# over #losing_card#.",
                "#winner#'s #winning_card# #beats# #loser#'s #losing_card#.",
                "#winner# with #winning_card.a# over #losing_card#.",
                "#winner#. #winning_card# over #losing_card#.",
                "#winner#'s hand."
            ],
            tied: [
                "Two #card.s#. #war#",
                "Two #card.s#. #war#",
                "#card.capitalize.s#. #war#",
                "#card.capitalize.s# all around. #war#"
            ],
            war: [
                "War!",
                "War!",
                "War!!",
                "War!!!",
                "We have a war!",
                "It's a war folks!"
            ],
            again: [
                "#winner# again.",
                "Another for #winner#.",
                "#winner# this time with the #winning_card#.",
                "#loser# falls to #winner# again.",
                "#call#"
            ],
            beats: ["beats", "bests", "tops"],
            loses: ["loses", "falls"]
        }
        const grammar = tracery.createGrammar(rules);
        grammar.addModifiers(tracery.baseEngModifiers)
        return grammar;
    }

    createCall(origin, winner, loser, winningCard, losingCard) {
        const winningCardName = this.deck.getName(winningCard);
        const losingCardName = this.deck.getName(losingCard)

        let rules = `[winner:${winner.lastName}]`;
        rules += `[loser:${loser.lastName}]`;
        rules += `[winning_card:${winningCardName}]`;
        rules += `[losing_card:${losingCardName}]`;
        rules += origin;
        return this.grammar.flatten(rules);
    }


    create() {
        let calls = []
        let wordCount = 0;


        let spreadAtLastUpdate = 0;
        let streak = 0;
        let lastWinner = null;
        let leader = null;
        let lastLeader = null;

    
        let call = `Looks like ${this.players[0].fullName} and ${this.players[1].fullName} are ready to start.`;
        calls.push(call);
    
        for(let i = 0; i < this.hands.length; i++) {
            let hand = this.hands[i];
            call = ""
            
            if( hand.winners.length == 1) {
                let winner = hand.winners[0];
                let loser = (hand.winners[0] + 1) % 2;

                streak = lastWinner === winner ? streak + 1 : 0;
                lastWinner = winner;

                leader = hand.counts[0] > hand.counts[1] ? 0 : 1;

                if(leader != lastLeader) {
                    call += `${this.players[winner].fullName} takes the lead with a ${this.deck.getName(hand.play[winner].identifier)}`;
                } else if( hand.activePlayers.length > 1 ) {
  
                    if(streak > 1) {
                        call += this.createCall("#again#", this.players[winner], this.players[loser], hand.play[winner].identifier, hand.play[loser].identifier);
                    } else {
                        call += this.createCall("#call#", this.players[winner], this.players[loser], hand.play[winner].identifier, hand.play[loser].identifier);
                    }
                    
                    const spread = hand.counts[0] - hand.counts[1];

                    if(Math.abs(spread - spreadAtLastUpdate) >= 8) {
                        if(hand.counts[0] !== hand.counts[1]) {
                            
                            call += ` ${this.players[leader].lastName} leads ${hand.counts[leader]} to ${hand.counts[(leader + 1) % 2]}.`;
                        } else {
                            call += " The games tied.";
                        }
                        spreadAtLastUpdate = spread;
                    }
                } else {
                    call += `That's the match folks. ${this.players[loser].fullName} has run out of cards.`;
                }
                lastLeader = leader;
            } else {
                let rank = this.deck.getRank(hand.play[0].identifier);
                streak = 0;
                
                call += this.grammar.flatten(`[card:${rank.toLowerCase()}]#tied#`);
            }
            wordCount += call.split(" ").length
            calls.push(call);
        }
        call = `${this.winner} wins in ${this.hands.length < 150 ? "just " : ""}${this.hands.length} hands.`;
        calls.push(call);
        return calls;
    }
}


module.exports = PlayByPlay;