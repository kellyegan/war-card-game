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

module.exports = Person;