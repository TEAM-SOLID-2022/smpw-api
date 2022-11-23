const functions = require("firebase-functions");
const firebase = require("firebase-admin");
const app = require("./index").app;
const { pick } = require("lodash");
const yup = require("yup");
const { transform_underscore } = require("../utils.js/transform_underscore");


const firestore = firebase.firestore(app);

// This is the function that will be called when the user clicks the "Add Territory" button
// in the app. It will create a new territory in the database.\

exports.addTerritory = functions.https.onRequest((request, response) => {

    const schema = yup.object({
        territoryName: yup.string().required("territoryName is required"),
        congregationId: yup.string().required("congregationId is required"),
    });

    schema.validate({
        ...request.body,
    }).then((val) => {

        // Get the territory name from the request body
        const territoryId = transform_underscore(request.body.territoryName);
        const congregationId = request.body.congregationId;

        const congregationRef = firestore.collection("congregations").doc(congregationId);

        congregationRef.get().then((congregation) => {

            if (!congregation.exists) return response.status(404).send("Congregation not Found!");

            const territoryRef = congregationRef.collection("territories").doc(territoryId);

            const freshData = pick(request.body, ["territoryDescription", "territoryName"]);

            // Create a new territory in the database
            territoryRef.create({
                ...freshData,
                congregationRef,
                status: "draft",
                createdAt: new Date(),
                approvedDate: null,
                updatedAt: new Date(),
            }).then(async (territory) => {

                const t_ = await territoryRef.get();
                response.send({ ...t_.data(), id: t_.id });

            }).catch((error) => response.status(400).send(error));

        });

    }).catch((error) => response.status(400).send(error));

});

// This is the function that will be called when the user clicks the "Get Territories" button
// in the app. It will get all territories from the database.\
exports.getTerritories = functions.https.onRequest((request, response) => {

    const schema = yup.object({
        congregationId: yup.string().required("congregationId is required"),
    });

    schema.validate(request.body).then((val) => {

        const congregationId = request.body.congregationId;
        const congregationRef = firestore.collection("congregations").doc(congregationId);
        const territoryColRef = congregationRef.collection("territories");

        territoryColRef.get().then((territories) => {

            const territories_ = territories.docs.map((territory) => {

                return { ...territory.data(), id: territory.id };

            });

            response.send(territories_);

        }).catch((error) => response.status(400).send(error));

    }).catch((error) => response.status(400).send(error));


});

// This is the function that will be called when the user clicks the "Get Territory" button
// in the app. It will get a territory from the database.\
exports.getTerritory = functions.https.onRequest((request, response) => {

    const schema = yup.object({
        congregationId: yup.string().required("congregationId is required"),
        territoryId: yup.string().required("territoryId is required"),
    });

    schema.validate(request.body).then((val) => {

        const congregationId = request.body.congregationId;
        const territoryId = request.body.territoryId;
        const congregationColRef = firestore.collection("congregations");
        const territoryRef = congregationColRef.doc(congregationId).collection("territories").doc(territoryId);
        territoryRef.get().then((territory) => {

            response.send({ ...territory.data(), id: territory.id });

        }).catch((error) => response.status(400).send(error));

    }).catch((error) => response.status(400).send(error));

});


// This is the function that will be called when the user clicks the "Update Territory" button
// in the app. It will update a territory in the database.\
exports.updateTerritory = functions.https.onRequest((request, response) => {

    const schema = yup.object({
        congregationId: yup.string().required("congregationId is required"),
        territoryId: yup.string().required("territoryId is required"),
    });
    schema.validate(request.body).then((val) => {

        const congregationId = request.body.congregationId;
        const territoryId = request.body.territoryId;

        const congregationRef = firestore.collection("congregations").doc(congregationId);
        const territoryRef = congregationRef.collection("territories").doc(territoryId);

        const freshData = pick(request.body, ["territoryDescription"]);

        territoryRef.update({
            ...freshData,
            updatedAt: new Date(),
        }).then(async (territory) => {

            const t_ = await territoryRef.get();
            response.send({ ...t_.data(), id: t_.id });

        }).catch((error) => response.status(400).send(error));

    }).catch((error) => response.status(400).send(error));

});


// This is the function that will be called when the user clicks the "Delete Territory" button
// in the app. It will delete a territory in the database.\
exports.deleteTerrory = functions.https.onRequest((request, response) => {


    const schema = yup.object({
        congregationId: yup.string().required("congregationId is required"),
        territoryId: yup.string().required("territoryId is required"),
    });

    schema.validate(request.body).then((val) => {

        const congregationId = request.body.congregationId;
        const territoryId = request.body.territoryId;

        const congregationRef = firestore.collection("congregations").doc(congregationId);
        const territorynRef = congregationRef.collection("territories").doc(territoryId);

        territorynRef.delete({
            exists: true,
        }).then(() => {

            response.send({ message: "Territory deleted successfully" });

        }).catch((error) => response.status(400).send(error));

    }).catch((error) => response.status(400).send(error));

});


// This is the function that will be called when the user clicks the "Appoved Territory" button
// in the app. It will update the status of a territory in the database.\
exports.approveTerritory = functions.https.onRequest((request, response) => {

    const schema = yup.object({
        congregationId: yup.string().required("congregationId is required"),
        territoryId: yup.string().required("territoryId is required"),
    });

    schema.validate(request.body).then((val) => {

        const congregationId = request.body.congregationId;
        const territoryId = request.body.territoryId;

        const congregationRef = firestore.collection("congregations").doc(congregationId);
        const territorynRef = congregationRef.collection("territories").doc(territoryId);

        territorynRef.update({

            status: "approved",
            approvedDate: new Date(),
            updatedAt: new Date(),

        }, {
            exists: true,
        }).then(async (territory) => {

            const t_ = await territory.get();
            response.send({ ...t_.data(), id: t_.id });

        }).catch((error) => response.status(400).send(error));

    }).catch((error) => response.status(400).send(error));

});