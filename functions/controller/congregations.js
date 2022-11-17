const functions = require("firebase-functions");
const firebase = require("firebase-admin");
const app = require("./index").app;
const firestore = firebase.firestore(app);


// This is the function that will be called when the user clicks the "Add Congregation" button
// in the app. It will create a new congregation in the database.\
exports.addCongregation = functions.https.onRequest((request, response) => {

    const congregationName = request.body.congregationName;
    const congregationDescription = request.body.congregationDescription;
    const congregationAddress = request.body.congregationAddress;

    firestore.collection("congregations").add({

        congregationName,
        congregationDescription,
        congregationAddress,
        status: "draft",
        createdAt: new Date(),
        verifiedDate: new Date(),
        updatedAt: new Date(),

    }).then(async (congregation) => {

        const c_ = await congregation.get();
        response.send({ ...c_.data(), id: c_.id });

    }).catch((error) => {

        functions.logger.info("Fail to add congregation");
        response.send(500).send(error);

    });

});


// This is the function that will be called when the user clicks the "Get Congregations" button
// in the app. It will get all congregations from the database.\
exports.getCongregations = functions.https.onRequest((request, response) => {

    firestore.collection("congregations").get().then((congregations) => {

        const congregations_ = congregations.docs.map((congregation) => {

            return { ...congregation.data(), id: congregation.id };

        });

        response.send(congregations_);

    }).catch((error) => {

        functions.logger.info("Fail to get congregations");
        response.send(500).send(error);

    });

});


// This is the function that will be called when the user clicks the "Get Congregation" button
// in the app. It will get a congregation from the database.\
exports.getCongregation = functions.https.onRequest((request, response) => {

    const congregationId = request.body.congregationId;
    if (!congregationId) return response.send(400).send("congregationId is required");

    firestore.collection("congregations").doc(congregationId).get().then((congregation) => {

        response.send({ ...congregation.data(), id: congregation.id });

    }).catch((error) => {

        functions.logger.info("Fail to get congregation");
        response.status(500).send(error);

    });

});


// This is the function that will be called when the user clicks the "Update Congregation" button
// in the app. It will update a congregation in the database.\
exports.updateCongregation = functions.https.onRequest((request, response) => {

    const congregationId = request.body.congregationId;
    if (!congregationId) return response.send(400).send("congregationId is required");

    const congregationName = request.body.congregationName;
    const congregationDescription = request.body.congregationDescription;
    const congregationAddress = request.body.congregationAddress;

    firestore.collection("congregations").doc(congregationId).update({

        congregationName,
        congregationDescription,
        congregationAddress,
        updatedAt: new Date(),

    }).then(async (congregation) => {

        const c_ = await congregation.get();
        response.send({ ...c_.data(), id: c_.id });

    }).catch((error) => {

        functions.logger.info("Fail to update congregation");
        response.status(500).send(error);

    });

});


// This is the function that will be called when the user clicks the "Delete Congregation" button
// in the app. It will delete a congregation from the database.\
exports.deleteCongregation = functions.https.onRequest((request, response) => {

    const congregationId = request.body.congregationId;
    if (!congregationId) return response.send(400).send("congregationId is required");

    firestore.collection("congregations").doc(congregationId).delete().then(() => {

        response.send("Congregation deleted successfully");

    }).catch((error) => {

        functions.logger.info("Fail to delete congregation");
        response.status(500).send(error);

    });

});


// This is the function that will be called when the user clicks the "Verify Congregation" button
// in the app. It will verify a congregation in the database.\
exports.verifyCongregation = functions.https.onRequest((request, response) => {

    const congregationId = request.body.congregationId;
    if (!congregationId) return response.send(400).send("congregationId is required");

    firestore.collection("congregations").doc(congregationId).update({

        status: "verified",
        verifiedDate: new Date(),
        updatedAt: new Date(),

    }).then(async (congregation) => {

        const c_ = await congregation.get();
        response.send({ ...c_.data(), id: c_.id });

    }).catch((error) => {

        functions.logger.info("Fail to verify congregation");
        response.status(500).send(error);

    });

});