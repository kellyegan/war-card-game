"use strict";

function PlayByPlay( game ){
    this.game = game;
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
                let winning_card = hand.play[winner].name;
                let losing_card = hand.play[loser].name;
                let prizeSize = hand.prize.length
                call += `${this.game.players[winner].lastName} beats ${this.game.players[loser].lastName} with ${winning_card} over ${losing_card} taking a prize of ${prizeSize}`
            } else {
                call += `That's the match folks. ${this.game.players[loser].person.fullName} has run out of cards.`;
            }

        } else {
            call += `Two ${hand.play[0].rank.toLowerCase()}s`
        }
        wordCount += call.split(" ").length
        calls.push(call);
    }
    call = `${this.game.players[0].fullName} wins in ${this.game.hands.length} hands.`;
    calls.push(call);
    return calls;
}