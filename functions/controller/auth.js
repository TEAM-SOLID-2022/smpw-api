const functions = require("firebase-functions");
// const firebase = require("firebase-admin");
// const app = require("./index").app;
// const firebaseAuth = firebase.auth(app);

exports.helloWorld = functions.https.onRequest((request, response) => {

    // const email = request.body.email;
    // const password = request.body.password;


    functions.logger.info("Hello logs!", { structuredData: true });
    response.send("Hello from Firebase!");

});