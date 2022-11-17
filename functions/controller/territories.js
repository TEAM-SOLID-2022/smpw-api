const functions = require("firebase-functions");
const firebase = require("firebase-admin");
const app = require("./index").app;


const firetore = firebase.firestore(app);

// This is the function that will be called when the user clicks the "Add Territory" button
// in the app. It will create a new territory in the database.\

exports.addTerritory = functions.https.onRequest((request, response) => {

    // Get the territory name from the request body
    const territoryName = request.body.territoryName;
    const territoryDescription = request.body.territoryDescription;

    // Create a new territory in the database
    firetore.collection("territories").add({
        territoryName,
        territoryDescription,
        status: "draft",
        createdAt: new Date(),
        approvedDate: new Date(),
        updatedAt: new Date(),
    }).then(async (territory) => {

        const t_ = await territory.get();
        response.send({ ...t_.data(), id: t_.id });

    }).catch((error) => {

        functions.logger.info("Fail to add territory");
        response.status(500).send(error);

    });

});

// This is the function that will be called when the user clicks the "Get Territories" button
// in the app. It will get all territories from the database.\
exports.getTerritories = functions.https.onRequest((request, response) => {

    firetore.collection("territories").get().then((territories) => {

        const territories_ = territories.docs.map((territory) => {

            return { ...territory.data(), id: territory.id };

        });

        response.send(territories_);

    }).catch((error) => {

        functions.logger.info("Fail to get territories");
        response.status(500).send(error);

    });

});

// This is the function that will be called when the user clicks the "Get Territory" button
// in the app. It will get a territory from the database.\
exports.getTerritory = functions.https.onRequest((request, response) => {

    const territoryId = request.body.territoryId;

    if (!territoryId) return response.status(400).send("territoryId is required");

    firetore.collection("territories").doc(territoryId).get().then((territory) => {

        response.send({ ...territory.data(), id: territory.id });

    }).catch((error) => {

        functions.logger.info("Fail to get territory");
        response.status(500).send(error);

    });

});


// This is the function that will be called when the user clicks the "Update Territory" button
// in the app. It will update a territory in the database.\
exports.updateTerritory = functions.https.onRequest((request, response) => {

    const territoryId = request.body.territoryId;

    if (!territoryId) return response.status(400).send("territoryId is required");

    const territoryName = request.body.territoryName;
    const territoryDescription = request.body.territoryDescription;

    firetore.collection("territories").doc(territoryId).update({
        territoryName,
        territoryDescription,
        updatedAt: new Date(),
    }).then(async (territory) => {

        const t_ = await territory.get();
        response.send({ ...t_.data(), id: t_.id });

    }).catch((error) => {

        functions.logger.info("Fail to update territory");
        response.status(500).send(error);

    });

});


// This is the function that will be called when the user clicks the "Delete Territory" button
// in the app. It will delete a territory in the database.\
exports.deleteTerrory = functions.https.onRequest((request, response) => {

    const territoryId = request.body.territoryId;
    if (!territoryId) return response.status(400).send("territoryId is required");

    firetore.collection("territories").doc(territoryId).delete().then(() => {

        response.send({ message: "Territory deleted successfully" });

    }).catch((error) => {

        functions.logger.info("Fail to delete territory");
        response.status(500).send(error);

    });

});


// This is the function that will be called when the user clicks the "Appoved Territory" button
// in the app. It will update the status of a territory in the database.\
exports.approveTerritory = functions.https.onRequest((request, response) => {

    const territoryId = request.body.territoryId;
    if (!territoryId) return response.status(400).send("territoryId is required");

    firetore.collection("territories").doc(territoryId).update({

        status: "approved",
        approvedDate: new Date(),
        updatedAt: new Date(),

    }).then(async (territory) => {

        const t_ = await territory.get();
        response.send({ ...t_.data(), id: t_.id });

    }).catch((error) => {

        functions.logger.info("Fail to approve territory");
        response.status(500).send(error);

    });

});