const functions = require("firebase-functions");
const firebase = require("firebase-admin");
const app = require("./index").app;
const firestore = firebase.firestore(app);
const yup = require("yup");
const { pick } = require("lodash");
const { transform_underscore } = require("../utils.js/transform_underscore");

// This is the function that will be called when the user clicks the "Add Publisher" button
// in the app. It will create a new publisher in the database.\
exports.addPublisher = functions.https.onRequest((request, response) => {

    const schema = yup.object({
        congregationId: yup.string().required("congregationId is required"),
        publisherLastCongragationId: yup.string().required("publisherLastCongragationId is required"),
        publisherName: yup.string().required("publisherName is required"),
        publisherDescription: yup.string().required("publisherDescription is required"),
        publisherAddress: yup.string().required("publisherAddress is required"),
        publisherEmail: yup.string().required("publisherEmail is required"),
        publisherPhone: yup.string().required("publisherPhone is required"),
        pulisherPrivilege: yup.string().required("pulisherPrivilege is required"),
    });

    schema.validate(request.body).then((val) => {

        const freshData = pick(request.body, ["publisherName", "publisherDescription", "publisherAddress", "publisherEmail", "publisherPhone", "pulisherPrivilege"]);

        const congregationId = request.body.congregationId;
        const publisherId = transform_underscore(request.body.publisherName);
        const publisherLastCongragationId = request.body.publisherLastCongragationId;

        const congregationRef = firestore.collection("congregations").doc(congregationId);

        congregationRef.get().then((doc) => {

            if (!doc.exists) {

                response.status(404).send("Congregation not found");

            } else {

                const publisherRef = congregationRef.collection("publishers").doc(publisherId);

                publisherRef.create({

                    ...freshData,
                    publisherStatus: null,
                    publisherLastCongragationRef: firestore.collection("congregations").doc(publisherLastCongragationId),
                    status: "draft",
                    createdAt: new Date(),
                    verifiedDate: null,
                    updatedAt: new Date(),

                }).then(async (publisher) => {

                    const p_ = await publisher.get();
                    response.send({ ...p_.data(), id: p_.id });

                }).catch((error) => response.status(400).send(error));

            }

        });

    }).catch((error) => response.status(400).send(error));

});


// This is the function that will be called when the user clicks the "Get Publishers" button
// in the app. It will get all publishers from the database.\
exports.getPublishers = functions.https.onRequest((request, response) => {

    const schema = yup.object({
        congregationId: yup.string().required("congregationId is required"),
    });

    schema.validate(request.body).then((val) => {

        const congregationId = request.body.congregationId;

        const congregationRef = firestore.collection("congregations").doc(congregationId);

        congregationRef.collection("publishers").get().then((publishers) => {

            const publishers_ = publishers.docs.map((publisher) => {

                return { ...publisher.data(), id: publisher.id };

            });

            response.send(publishers_);

        }).catch((error) => response.status(400).send(error));

    }).catch((error) => response.status(400).send(error));

});


// This is the function that will be called when the user clicks the "Get Publisher" button
// in the app. It will get a publisher from the database.\
exports.getPublisher = functions.https.onRequest((request, response) => {

    const schema = yup.object({
        congregationId: yup.string().required("congregationId is required"),
        publisherId: yup.string().required("publisherId is required"),
    });

    schema.validate(request.body).then((val) => {

        const congregationId = request.body.congregationId;
        const publisherId = request.body.publisherId;

        const congregationRef = firestore.collection("congregations").doc(congregationId);
        const publisherRef = congregationRef.collection("publishers").doc(publisherId);

        publisherRef.get().then((publisher) => {

            response.send({ ...publisher.data(), id: publisher.id });

        }).catch((error) => response.status(400).send(error));

    }).catch((error) => response.status(400).send(error));


});


// This is the function that will be called when the user clicks the "Update Publisher" button
// in the app. It will update a publisher in the database.\
exports.updatePublisher = functions.https.onRequest((request, response) => {

    const schema = yup.object({
        congregationId: yup.string().required("congregationId is required"),
        publisherId: yup.string().required("publisherId is required"),
    });

    schema.validate(request.body).then((val) => {

        const congregationId = request.body.congregationId;
        const publisherId = request.body.publisherId;


        const congregationRef = firestore.collection("congregations").doc(congregationId);
        const publisherRef = congregationRef.collection("publishers").doc(publisherId);

        const freshData = pick(request.body, ["publisherName", "publisherDescription", "publisherAddress", "publisherEmail", "publisherPhone", "pulisherPrivilege"]);

        publisherRef.update({

            ...freshData,
            updatedAt: new Date(),

        }).then(async (publisher) => {

            const p_ = await publisherRef.get();
            response.send({ ...p_.data(), id: p_.id });

        }).catch((error) => response.status(400).send(error));

    }).catch((error) => response.status(400).send(error));

});


// This is the function that will be called when the user clicks the "Delete Publisher" button
// in the app. It will delete a publisher from the database.\
exports.deletePublisher = functions.https.onRequest((request, response) => {

    const schema = yup.object({
        congregationId: yup.string().required("congregationId is required"),
        publisherId: yup.string().required("publisherId is required"),
    });

    schema.validate(request.body).then((val) => {

        const congregationId = request.body.congregationId;
        const publisherId = request.body.publisherId;

        const congregationRef = firestore.collection("congregations").doc(congregationId);
        const publisherRef = congregationRef.collection("publishers").doc(publisherId);

        publisherRef.delete({ exists: true }).then(() => {

            response.send("Publisher deleted successfully");

        }).catch((error) => response.status(400).send(error));

    }).catch((error) => response.status(400).send(error));

});

// This is the function that will be called when the user clicks the "Verify Publisher" button
// in the app. It will verify a publisher in the database.\
exports.verifyPublisher = functions.https.onRequest((request, response) => {

    const schema = yup.object({
        congregationId: yup.string().required("congregationId is required"),
        publisherId: yup.string().required("publisherId is required"),
    });

    schema.validate(request.body).then((val) => {

        const congregationId = request.body.congregationId;
        const publisherId = request.body.publisherId;

        const congregationRef = firestore.collection("congregations").doc(congregationId);
        const publisherRef = congregationRef.collection("publishers").doc(publisherId);

        publisherRef.update({

            status: "verified",
            verifiedDate: new Date(),

        }, { exists: true }).then(async (publisher) => {

            const p_ = await publisherRef.get();
            response.send({ ...p_.data(), id: p_.id });

        }).catch((error) => response.status(400).send(error));

    }).catch((error) => response.status(400).send(error));

});

// Get Authenticated User
exports.getAuthenticatedUser = functions.https.onRequest((request, response) => {

    const user = request.user;
    if (!user) return response.status(400).send("User is not authenticated");

    response.send(user);

});