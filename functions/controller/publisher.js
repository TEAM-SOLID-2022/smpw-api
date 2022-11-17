const functions = require("firebase-functions");
const firebase = require("firebase-admin");
const app = require("./index").app;
const firestore = firebase.firestore(app);

// This is the function that will be called when the user clicks the "Add Publisher" button
// in the app. It will create a new publisher in the database.\
exports.addPublisher = functions.https.onRequest((request, response) => {

    const publisherName = request.body.publisherName;
    const publisherDescription = request.body.publisherDescription;
    const publisherAddress = request.body.publisherAddress;
    const publisherEmail = request.body.publisherEmail;
    const publisherPhone = request.body.publisherPhone;
    const publisherStatus = request.body.publisherStatus;
    const pulisherPrivilege = request.body.pulisherPrivilege;
    const publisherLastCongragationId = request.body.publisherLastCongragationId;


    firestore.collection("publishers").add({

        publisherName,
        publisherDescription,
        publisherAddress,
        publisherEmail,
        publisherPhone,
        publisherStatus,
        pulisherPrivilege,
        publisherLastCongragationRef: firestore.doc(`congregations/${publisherLastCongragationId}`),
        status: "draft",
        createdAt: new Date(),
        verifiedDate: new Date(),
        updatedAt: new Date(),

    }).then(async (publisher) => {

        const p_ = await publisher.get();
        response.send({ ...p_.data(), id: p_.id });

    }).catch((error) => {

        functions.logger.info("Fail to add publisher");
        response.status(500).send(error);

    });

});


// This is the function that will be called when the user clicks the "Get Publishers" button
// in the app. It will get all publishers from the database.\
exports.getPublishers = functions.https.onRequest((request, response) => {

    firestore.collection("publishers").get().then((publishers) => {

        const publishers_ = publishers.docs.map((publisher) => {

            return { ...publisher.data(), id: publisher.id };

        });

        response.send(publishers_);

    }).catch((error) => {

        functions.logger.info("Fail to get publishers");
        response.status(500).send(error);

    });

});


// This is the function that will be called when the user clicks the "Get Publisher" button
// in the app. It will get a publisher from the database.\
exports.getPublisher = functions.https.onRequest((request, response) => {

    const publisherId = request.body.publisherId;
    if (!publisherId) return response.status(400).send("Publisher Id is required");

    firestore.collection("publishers").doc(publisherId).get().then((publisher) => {

        response.send({ ...publisher.data(), id: publisher.id });

    }).catch((error) => {

        functions.logger.info("Fail to get publisher");
        response.status(500).send(error);

    });

});


// This is the function that will be called when the user clicks the "Update Publisher" button
// in the app. It will update a publisher in the database.\
exports.updatePublisher = functions.https.onRequest((request, response) => {

    const publisherId = request.body.publisherId;
    if (!publisherId) return response.status(400).send("Publisher Id is required");

    const publisherName = request.body.publisherName;
    const publisherDescription = request.body.publisherDescription;
    const publisherAddress = request.body.publisherAddress;
    const publisherEmail = request.body.publisherEmail;
    const publisherPhone = request.body.publisherPhone;
    const publisherStatus = request.body.publisherStatus;
    const pulisherPrivilege = request.body.pulisherPrivilege;
    const publisherLastCongragationId = request.body.publisherLastCongragationId;

    firestore.collection("publishers").doc(publisherId).update({

        publisherName,
        publisherDescription,
        publisherAddress,
        publisherEmail,
        publisherPhone,
        publisherStatus,
        pulisherPrivilege,
        publisherLastCongragationRef: firestore.doc(`congregations/${publisherLastCongragationId}`),
        updatedAt: new Date(),

    }).then(async (publisher) => {

        const p_ = await publisher.get();
        response.send({ ...p_.data(), id: p_.id });

    }).catch((error) => {

        functions.logger.info("Fail to update publisher");
        response.status(500).send(error);

    });

});


// This is the function that will be called when the user clicks the "Delete Publisher" button
// in the app. It will delete a publisher from the database.\
exports.deletePublisher = functions.https.onRequest((request, response) => {

    const publisherId = request.body.publisherId;
    if (!publisherId) return response.status(400).send("Publisher Id is required");

    firestore.collection("publishers").doc(publisherId).delete().then(() => {

        response.send("Publisher deleted successfully");

    }).catch((error) => {

        functions.logger.info("Fail to delete publisher");
        response.status(500).send(error);

    });

});

// This is the function that will be called when the user clicks the "Verify Publisher" button
// in the app. It will verify a publisher in the database.\
exports.verifyPublisher = functions.https.onRequest((request, response) => {

    const publisherId = request.body.publisherId;
    if (!publisherId) return response.status(400).send("Publisher Id is required");

    firestore.collection("publishers").doc(publisherId).update({

        status: "verified",
        verifiedDate: new Date(),

    }).then(async (publisher) => {

        const p_ = await publisher.get();
        response.send({ ...p_.data(), id: p_.id });

    }).catch((error) => {

        functions.logger.info("Fail to verify publisher");
        response.status(500).send(error);

    });

});

// Get Authenticated User
exports.getAuthenticatedUser = functions.https.onRequest((request, response) => {

    const user = request.user;
    if (!user) return response.status(400).send("User is not authenticated");

    response.send(user);

});