const { helloWorld } = require("./controller/auth");
const territory = require("./controller/territory");
const congregation = require("./controller/congregation");
const publisher = require("./controller/publisher");

exports.auth = helloWorld;
exports.territory = territory;
exports.congregation = congregation;
exports.publisher = publisher;