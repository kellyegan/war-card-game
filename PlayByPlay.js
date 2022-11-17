"use strict";
const tracery = require("tracery-grammar");
const CardDeck = require("./CardDeck")

class PlayByPlay {
    constructor( game ) {
        this.players = game.players;
        this.hands = game.hands;
        this.winner = game.winner;
        this.deck = new CardDeck.Deck();   
    }

    getGrammar() {
        const rules = {
            call: [
                "#winner# #beats# #loser# with #winning_card# over #losing_card#.",
                "#winner#'s #winning_card# #beats# #loser#'s #losing_card#.",
                "#winner# with #winning_card.a# over #losing_card#.",
                "#winner#. #winning_card# over #losing_card#.",
                "#winner# takes it.",
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
            beats: ["beats", "bests", "tops", "takes"],
            loses: ["loses", "falls"]
        }
        const grammar = tracery.createGrammar(rules);
        grammar.addModifiers(tracery.baseEngModifiers)
        return grammar;
    }


    create() {
        let calls = []
        let wordCount = 0;
        let grammar = this.getGrammar();

        let lastSpread = 0;
        let streak = 0;
        let lastWinner = null;

    
        let call = `Looks like ${this.players[0].fullName} and ${this.players[1].fullName} are ready to start.`;
        calls.push(call);
    
        for(let i = 0; i < this.hands.length; i++) {
            let hand = this.hands[i];
            call = ""
            
            if( hand.winners.length == 1) {
                let winner = hand.winners[0];
                let loser = (hand.winners[0] + 1) % 2;

                if( lastWinner === winner ) {
                    streak++;
                } else {
                    streak = 0;
                }
                lastWinner = winner;


                if( hand.activePlayers.length > 1 ) {
                    const winning_card = this.deck.getName(hand.play[winner].identifier);
                    const losing_card = this.deck.getName(hand.play[loser].identifier);

                    call += grammar.flatten(`[winner:${this.players[winner].lastName}][winning_card:${winning_card}][loser:${this.players[loser].lastName}][losing_card:${losing_card}]#call#`);
                    
                    const spread = hand.counts[0] - hand.counts[1];
                    if(Math.abs(spread - lastSpread) >= 8) {
                        let leader = hand.counts[0] > hand.counts[1] ? 0 : 1;
                        
                        call += ` ${this.players[leader].lastName} leads ${hand.counts[leader]} to ${hand.counts[(leader + 1) % 2]}`;
                        lastSpread = spread;
                    }

                } else {
                    call += `That's the match folks. ${this.players[loser].fullName} has run out of cards.`;
                }
    
            } else {
                let rank = this.deck.getRank(hand.play[0].identifier);
                
                call += grammar.flatten(`[card:${rank.toLowerCase()}]#tied#`);
            }
            wordCount += call.split(" ").length
            calls.push(call);
        }
        call = `${this.winner} wins in ${this.hands.length < 100 ? "just " : ""}${this.hands.length} hands.`;
        calls.push(call);
        return calls;
    }
}


module.exports = PlayByPlay;