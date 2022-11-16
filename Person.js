"use strict";

const firstNames = require("./data/firstNames.json");
const lastNames = require("./data/lastNames.json");

class Person {
  constructor() {
    let firstName =
      firstNames.firstNames[
        Math.floor(Math.random() * firstNames.firstNames.length)
      ];
    let lastName =
      lastNames.lastNames[
        Math.floor(Math.random() * lastNames.lastNames.length)
      ];
    let pronoun =
      firstName.pronouns[Math.floor(Math.random() * firstName.pronouns.length)];

    this.firstName = firstName.name;
    this.lastName = lastName;
    this.pronoun = pronoun;
  }

  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }

}

module.exports = Person;
