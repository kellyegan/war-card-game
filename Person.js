"use strict";

const firstNames = require('./data/firstNames.json');
const lastNames = require('./data/lastNames.json');

function Person(firstName, lastName, pronoun) {

    this.firstName = firstName;
    this.lastName = lastName;
    this.pronoun = pronoun;
}

Person.prototype.fullName = function () {
    return `${this.firstName} ${this.lastName}`
}

Person.generatePerson = function() {
    let firstName = firstNames.firstNames[Math.floor(Math.random() * firstNames.firstNames.length)];
    let lastName = lastNames.lastNames[Math.floor(Math.random() * lastNames.lastNames.length) ];
    let pronoun = firstName.pronouns[Math.floor(Math.random() * firstName.pronouns.length)];
    return new Person(firstName.name, lastName, pronoun);
}

module.exports = Person;