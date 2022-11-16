"use strict";

class Card {
  constructor(value, rank, suit, identifier) {
    this.value = value;
    this.rank = rank;
    this.suit = suit;
    this.identifier = identifier;
  }

  get name() {
    return this.rank + " of " + this.suit.name;
  }
}

class Deck {
  constructor() {
    let suits = [
      { name: "Clubs", symbol: "♣" },
      { name: "Diamonds", symbol: "♦" },
      { name: "Hearts", symbol: "♥" },
      { name: "Spades", symbol: "♠" },
    ];
    let ranks = [
      "Two",
      "Three",
      "Four",
      "Five",
      "Six",
      "Seven",
      "Eight",
      "Nine",
      "Ten",
      "Jack",
      "Queen",
      "King",
      "Ace",
    ];

    let count = 0;
    this.cards = new Map();

    suits.forEach((suit) => {
      ranks.forEach((rank, value) => {
        let identifier = `${value < 9 ? value + 2 : rank[0]}`;
        identifier += suit.name[0];
        this.cards.set(identifier, new Card(value, rank, suit, identifier));
        count++;
      });
    });
  }

  /**
   *  Fisher-Yates Shuffle from Mike Bostock
   */
  shuffle(array) {
    var m = array.length,
      t,
      i;

    // While there remain elements to shuffle…
    while (m) {
      // Pick a remaining element…
      i = Math.floor(Math.random() * m--);

      // And swap it with the current element.
      t = array[m];
      array[m] = array[i];
      array[i] = t;
    }
    return array;
  }

  getDeck(shuffleDeck = true) {
    let cardArray = Array.from(this.cards.values());
    if(shuffleDeck) {
        return this.shuffle(cardArray) 
    }
    return cardArray;
  }

  getCard(identifier) {
    return this.cards.get(identifier);
  }
}

module.exports = { Card, Deck };
