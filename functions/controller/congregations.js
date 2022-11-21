const functions = require("firebase-functions");
const firebase = require("firebase-admin");
const app = require("./index").app;
const firestore = firebase.firestore(app);
const yup = require("yup");
const { pick } = require("lodash");
const { transform_underscore } = require("../utils.js/transform_underscore");


// This is the function that will be called when the user clicks the "Add Congregation" button
// in the app. It will create a new congregation in the database.\
exports.addCongregation = functions.https.onRequest((request, response) => {

    const schema = yup.object({
        congregationName: yup.string().required("congregationName is required"),
        congregationDescription: yup.string().required("congregationDescription is required"),
        congregationAddress: yup.string().required("congregationAddress is required"),
    });

    schema.validate(request.body).then((val) => {

        const congregationId = transform_underscore(request.body.congregationName);
        const freshData = pick(request.body, ["congregationName", "congregationDescription", "congregationAddress"]);

        const congregationRef = firestore.collection("congregations").doc(congregationId);

        congregationRef.create({

            ...freshData,
            status: "draft",
            createdAt: new Date(),
            verifiedDate: null,
            updatedAt: new Date(),

        }).then(async (congregation) => {

            const c_ = await congregation.get();
            response.send({ ...c_.data(), id: c_.id });

        }).catch((error) => response.send(400).send(error));

    }).catch((error) => response.status(400).send(error));

});


// This is the function that will be called when the user clicks the "Get Congregations" button
// in the app. It will get all congregations from the database.\
exports.getCongregations = functions.https.onRequest((request, response) => {

    const congregationRef = firestore.collection("congregations");

    congregationRef.get().then((congregations) => {

        const congregations_ = congregations.docs.map((congregation) => {

            return { ...congregation.data(), id: congregation.id };

        });

        response.send(congregations_);

    }).catch((error) => response.send(400).send(error));

});


// This is the function that will be called when the user clicks the "Get Congregation" button
// in the app. It will get a congregation from the database.\
exports.getCongregation = functions.https.onRequest((request, response) => {


    const schema = yup.object({
        congregationId: yup.string().required("congregationId is required"),
    });

    schema.validate(request.body).then((val) => {

        const congregationId = request.body.congregationId;

        const congregationRef = firestore.collection("congregations").doc(congregationId);

        congregationRef.get().then((congregation) => {

            response.send({ ...congregation.data(), id: congregation.id });

        }).catch((error) => response.status(400).send(error));

    }).catch((error) => response.status(400).send(error));

});


// This is the function that will be called when the user clicks the "Update Congregation" button
// in the app. It will update a congregation in the database.\
exports.updateCongregation = functions.https.onRequest((request, response) => {

    const schema = yup.object({
        congregationName: yup.string().required("congregationName is required"),
        congregationDescription: yup.string().required("congregationDescription is required"),
        congregationAddress: yup.string().required("congregationAddress is required"),
    });

    schema.validate(request.body).then((val) => {

        const congregationId = request.body.congregationId;

        const congregationRef = firestore.collection("congregations").doc(congregationId);
        const freshData = pick(request.body, ["congregationName", "congregationDescription", "congregationAddress"]);

        congregationRef.update({

            ...freshData,
            updatedAt: new Date(),

        }, {
            exists: true,
        }).then(async (congregation) => {

            const c_ = await congregationRef.get();
            response.send({ ...c_.data(), id: c_.id });

        }).catch((error) => response.status(400).send(error));

    }).catch((error) => response.status(400).send(error));

});


// This is the function that will be called when the user clicks the "Delete Congregation" button
// in the app. It will delete a congregation from the database.\
exports.deleteCongregation = functions.https.onRequest((request, response) => {

    const schema = yup.object({
        congregationId: yup.string().required("congregationId is required"),
    });

    schema.validate(request.body).then((val) => {

        const congregationId = request.body.congregationId;

        const congregationRef = firestore.collection("congregations").doc(congregationId);

        congregationRef.delete({ exists: true }).then(() => {

            response.send("Congregation deleted successfully");

        }).catch((error) => response.status(400).send(error));

    }).catch((error) => response.status(400).send(error));

});


// This is the function that will be called when the user clicks the "Verify Congregation" button
// in the app. It will verify a congregation in the database.\
exports.verifyCongregation = functions.https.onRequest((request, response) => {

    const schema = yup.object({
        congregationId: yup.string().required("congregationId is required"),
    });

    schema.validate(request.body).then((val) => {

        const congregationId = request.body.congregationId;

        const congregationRef = firestore.collection("congregations").doc(congregationId);
        congregationRef.update({

            status: "verified",
            verifiedDate: new Date(),
            updatedAt: new Date(),

        }, { exists: true }).then(async (congregation) => {

            const c_ = await congregationRef.get();
            response.send({ ...c_.data(), id: c_.id });

        }).catch((error) => response.status(400).send(error));

    }).catch((error) => response.status(400).send(error));


});