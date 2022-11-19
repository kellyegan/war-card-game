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
            again: [
                "#winner# again.",
                "#winner# wins again. #winningCardRank.capitalize# over #losingCardRank#.",
                "Another for #winner#.",
                "Another for #winner#. #winningCardRank.capitalize# over #losingCardRank#.",
                "#winner# this time with the #winningCardName#.",
                "#loser# falls to #winner# again.",
                "#winner# continues streak. #winningCardRank.capitalize# over #losingCardRank#.",
                "#call#"
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
                "#winner#'s #winningCardRank# wins the battle taking #prize# cards.",
                "#winner# defeats #loser# with #winningCardRank.a#, takes #prize# cards.",
                "#loser# loses the battle. #winner# takes #prize# cards.",
            ],
            beats: ["beats", "bests", "tops"],
            loses: ["loses", "falls"]
        }
        const grammar = tracery.createGrammar(rules);
        grammar.addModifiers(tracery.baseEngModifiers)
        return grammar;
    }

    createCall(origin, handDetails) {  
        let rules = `[winner:${handDetails.winner.lastName}]`;
        rules += `[loser:${handDetails.loser.lastName}]`;
        rules += `[winningCardName:${handDetails.winningCard.name}]`;
        rules += `[winningCardRank:${handDetails.winningCard.rank.toLowerCase()}]`;
        rules += `[losingCardName:${handDetails.losingCard.name}]`;
        rules += `[losingCardRank:${handDetails.losingCard.rank.toLowerCase()}]`;
        rules += `[prize:${handDetails.prize}]`;
        rules += origin;
        return this.grammar.flatten(rules);
    }

    parseHand(hand) {
        let details = {}
        details.war = hand.war;
        details.prize = hand.prize;

        details.leader = hand.counts[0] > hand.counts[1] ? 0 : 1;

        if( hand.counts[0] === 0 ) {
            details.gameover = true;
            details.winner = this.players[1];
            details.loser = this.players[0];
        }

        if( hand.counts[1] === 0 ) {
            details.gameover = true;
            details.winner = this.players[0];
            details.loser = this.players[1];
        }
        
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
                    if(!handDetails.war) {
                        if(streak > 1) {
                            call += this.createCall("#again#", handDetails);
                        } else {
                            call += this.createCall("#call#", handDetails);
                        }
                    } else {
                        call += this.createCall("#warOver#", handDetails);
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
                    const rank = handDetails.rank.toLowerCase();
                    call += this.grammar.flatten(`[card:${rank}]#tied#`);
                }
            } else {
                if(handDetails.losingCard) {
                    call += `${handDetails.winner.lastName}'s ${handDetails.winningCard.name} beats ${handDetails.loser.lastName}'s ${handDetails.losingCard.name} to finish the game.`
                } else {
                    call += `${handDetails.loser.lastName} is out of cards. That's the game.`
                }
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