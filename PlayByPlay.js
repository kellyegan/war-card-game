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
                "#winner# #beats# #loser# with #winningCardName# over #losingCardName#.",
                "#winner#'s #winningCardRank# #beats# #loser#'s #losingCardRank#.",
                "#winner# with #winningCardName.a# over #losingCardName#.",
                "#winner#. #winningCardRank.capitalize# over #losingCardRank#.",
                "#winningCardRank.capitalize# over #losingCardRank#. #winner#.",
                "#loser#'s #losingCardRank# #loses# to #winner#'s #winningCardRank#.",
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
            warOver: [
                "#winner#'s #winningCardRank# wins the battle. #prize# cards are the spoils.`",
                "#winner# defeats #loser# with #winningCardRank.a#, takes #prize# cards.`",
                "#loser# is defeated. #winner# takes #prize# cards.",
            ],
            again: [
                "#winner# again.",
                "Another for #winner#.",
                "#winner# this time with the #winningCardName#.",
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

    createCall(origin, winner, loser, winningCard, losingCard, prize) {        
        let rules = `[winner:${winner.lastName}]`;
        rules += `[loser:${loser.lastName}]`;
        rules += `[winningCardName:${winningCard.name}]`;
        rules += `[winningCardRank:${winningCard.rank.toLowerCase()}]`;
        rules += `[losingCardName:${losingCard.name}]`;
        rules += `[losingCardRank:${losingCard.rank.toLowerCase()}]`;
        rules += `[prize:${prize}]`;
        rules += origin;
        return this.grammar.flatten(rules);
    }

    parseHand(hand) {
        let details = {}
        details.war = hand.war;
        details.prize = hand.prize;

        details.leader = hand.counts[0] > hand.counts[1] ? 0 : 1;

        details.gameover = hand.counts[0] === 0 || hand.counts[1] === 0;
        
        if(hand.winners.length == 1) {
            details.tie = false;
            const winnerIndex = hand.winners[0];
            const loserIndex = (hand.winners[0] + 1) % 2;

            details.winner = this.players[winnerIndex];
            details.loser = this.players[loserIndex];
            
            if(hand.play.length > 1) {
                details.winningCard = this.deck.getCard(hand.play[winnerIndex].identifier);
                details.losingCard = this.deck.getCard(hand.play[loserIndex].identifier);
            } else {
                details.winningCard = this.deck.getCard(hand.play[0].identifier);
            }
            
        } else {
            details.tie = true;
            details.rank = this.deck.getRank(hand.play[0].identifier);
        }

        return details;
    }

    create() {
        let calls = []
        let wordCount = 0;

        let spreadAtLastUpdate = 0;
        let streak = 0;
        let lastWinner = null;
        let leader = null;
        let lastLeader = null;
        let lastLeadChange;
    
        let call = `Looks like ${this.players[0].fullName} and ${this.players[1].fullName} are ready to start.`;
        calls.push(call);
        
        this.hands.forEach((hand, index) => {
            let handDetails = this.parseHand(hand);
            call = ""

            //Track winning streak
            streak = lastWinner === handDetails.winner ? streak + 1 : 0;
            lastWinner = handDetails.winner;

            //Track change in who leads
            leader = hand.counts[0] > hand.counts[1] ? 0 : 1;

            if( !handDetails.gameover ) {
                if(!handDetails.tie) {
                    call += this.createCall("#call#", handDetails.winner, handDetails.loser, handDetails.winningCard, handDetails.losingCard, handDetails.prize);
                } else {
                    const rank = handDetails.rank.toLowerCase();
                    call += this.grammar.flatten(`[card:${rank}]#tied#`);
                }
            } else {
                call += "Game over."
            }

            lastLeader = leader;
            if(call !== "") {
                calls.push(call);
            }
        });

        call = `${this.winner} wins in ${this.hands.length < 150 ? "just " : ""}${this.hands.length} hands.`;
        calls.push(call);
        return calls;
    }
}


module.exports = PlayByPlay;