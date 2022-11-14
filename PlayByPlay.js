"use strict";

function PlayByPlay( game ){
    this.game = game;
}

module.exports = PlayByPlay;

PlayByPlay.prototype.generate = function () {
    let calls = []
    let wordCount = 0;

    for(let i = 0; i < this.game.hands.length; i++) {
        let currentHand = this.game.hands[i];
        let call = ""

        if(currentHand.war) {
            call += "War!!! "
        }

        if( currentHand.winners.length == 1) {
            let winner = currentHand.winners[0];
            let loser = (currentHand.winners[0] + 1) % 2;
            let winning_card = currentHand.play[winner] ? currentHand.play[winner].name : null;
            let losing_card = currentHand.play[loser] ? currentHand.play[loser].name : null;
            let prizeSize = currentHand.prize.length
            call += `${this.game.players[winner]} beats ${this.game.players[loser]} with ${winning_card} over ${losing_card} taking a prize of ${prizeSize}`
        } else {
            call += `Two ${currentHand.play[0].rank}s`
        }
        wordCount += call.split(" ").length
        calls.push(call);
    }
    console.log(wordCount);
    return calls;
}