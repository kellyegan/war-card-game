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


}

module.exports = Stats;
