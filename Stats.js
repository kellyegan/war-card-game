class Stats {
  /**
   * Return a map for a series of games ranks by number of hands 
   * @param {*} games
   * @returns {Map}
   */
  static rankGamesByLength(games) {
    return games
      .slice()
      .sort((a, b) => a.hands.length - b.hands.length)
      .reduce((map, game, index) => {
        return map.set(game.id, { hands: game.hands.length, rank: index });
      }, new Map());
  }

  /**
   * Return stats on who held the lead, and when leader changes happened for a game
   * @param {*} game 
   * @returns 
   */
  static getLeaderTransistions(hands) {
    let leader = 2;
    let lastLeader = 2;
    let lastIndex = 0;

    return hands.reduce(
      (result, hand, index) => {
        // Index 2 is for a tied hand
        leader = 2;
        if (hand.counts[0] !== hand.counts[1]) {
          leader = hand.counts[0] > hand.counts[1] ? 0 : 1;
        }

        if (leader !== lastLeader) {
          //Record who the leader is and what hand it is
          result.leaderChanges.push({ leader: leader, hand: index });

          //Count hands since last change add to last leaders total
          result.handsPerPlayer[lastLeader] += index - lastIndex;

          lastIndex = index;
        }
        lastLeader = leader;

        //Count hands between last change and end of game add to final leaders total
        if (index == hands.length - 1) {
          result.handsPerPlayer[leader] += hands.length - lastIndex;
        }
        return result;
      },
      { handsPerPlayer: [0, 0, 0], leaderChanges: [] }
    );
  }
}

module.exports = Stats;
