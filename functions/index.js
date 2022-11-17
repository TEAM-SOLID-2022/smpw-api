const { helloWorld } = require("./controller/auth");
const territories = require("./controller/territories");
const congregations = require("./controller/congregations");
const publisher = require("./controller/publisher");

exports.auth = helloWorld;
exports.territories = territories;
exports.congregations = congregations;
exports.publisher = publisher;