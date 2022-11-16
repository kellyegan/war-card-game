"use strict";

const CardDeck = require("./CardDeck")

function PlayByPlay( game ){
    this.game = game;
    this.deck = new CardDeck.Deck();
}

module.exports = PlayByPlay;

PlayByPlay.prototype.generate = function () {
    let calls = []
    let wordCount = 0;

    let call = `Looks like ${this.game.players[0].fullName} and ${this.game.players[1].fullName} are ready to start.`;
    calls.push(call);

    for(let i = 0; i < this.game.hands.length; i++) {
        let hand = this.game.hands[i];
        call = ""

        if(hand.war) {
            call += "War!!! "
        }
        
        if( hand.winners.length == 1) {
            let winner = hand.winners[0];
            let loser = (hand.winners[0] + 1) % 2;
            if( hand.activePlayers.length > 1 ) {
                const winning_card = this.deck.getName(hand.play[winner].identifier);
                const losing_card = this.deck.getName(hand.play[loser].identifier);
                const prizeSize = hand.prize.length
                call += `${this.game.players[winner].lastName} beats ${this.game.players[loser].lastName} with ${winning_card} over ${losing_card} taking a prize of ${prizeSize}`
            } else {
                call += `That's the match folks. ${this.game.players[loser].fullName} has run out of cards.`;
            }

        } else {
            let rank = this.deck.getRank(hand.play[0].identifier);
            call += `Two ${rank.toLowerCase()}s`
        }
        wordCount += call.split(" ").length
        calls.push(call);
    }
    call = `${this.game.winner} wins in ${this.game.hands.length} hands.`;
    calls.push(call);
    return calls;
}