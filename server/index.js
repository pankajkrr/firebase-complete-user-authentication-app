
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

const functions = require('firebase-functions');
const admin = require("firebase-admin");
// const config = require('./config')

admin.initializeApp({
    apiKey: functions.config()['appointment-app'].api_key,
    authDomain: functions.config()['appointment-app'].auth_domain,
    databaseURL: functions.config()['appointment-app'].database_url,
    projectId: functions.config()['appointment-app'].project_id,
    storageBucket: functions.config()['appointment-app'].storage_bucket,
    messagingSenderId: functions.config()['appointment-app'].messaging_sender_id
});
  
const stripe = require('stripe')(functions.config().stripe.testkey);

const express = require('express');
const cors = require('cors');
const app = express();
const db = admin.firestore();
let FieldValue = require('firebase-admin').firestore.FieldValue;
const uniqid = require('uniqid');
app.use(cors({
    origin: true
}));

// Method to add new client to firestore
async function addClient(req, res) {
    try {
        let obj = {
            firstName: req.body.firstName ? req.body.firstName : '',
            lastName: req.body.lastName ? req.body.lastName : '',
            email: req.body.email ? req.body.email : '',
            createdOn: new Date(),
            clientId : uniqid()
        }
        await db.collection("clients").doc().set(obj, {
            merge: true
        }).then(result => {
            console.log('Success response : ', res);
            res.status(200).send({
                message: 'Success',
                info: result,
            });
        }).catch(err => {
            console.log('Error in saving render Image metadata:', err);
            return res.status(400).send(err);

        });
    } catch (error) {
        console.error(error)
        return res.status(400).send(error);
    }
}

// Method to get client list from firestore
async function clientList(req, res) {
    try {
        const dbData = await db.collection("clients").get();
        dbData.docs.map(doc=>doc.data());
        console.log('Success response : ', res);
        res.status(200).send({
            message: 'Success',
            result: dbData.docs.map(doc=>doc.data())
        });
    } catch (error) {
        console.error(error)
        return res.status(400).send(error);
    }
}

// Method to schedule appointment
async function ScheduleAppointment(req, res) {
    try {
        let obj = {
            title: req.body.title ? req.body.title : '',
            description: req.body.description ? req.body.description : '',
            dateTime: req.body.dateTime,
            clientId : req.body.clientId
        }
        await db.collection("appointments").doc().set(obj, {
            merge: true
        }).then(result => {
            console.log('Success response : ', res);
            res.status(200).send({
                message: 'Success',
                info: result,
            });
        }).catch(err => {
            console.log('Error in saving render Image metadata:', err);
            return res.status(400).send(err);

        });
    } catch (error) {
        console.error(error)
        return res.status(400).send(error);
    }
}

// Method to get the list of appointment list
async function appointmentList(req, res) {
    try {
        const dbData = await db.collection("appointments").where("clientId", "==", req.query.clientId).get(); //db.collection("appointments").doc().collection("clients").get(); 
        dbData.docs.map(doc=>doc.data());
        res.status(200).send({
            message: 'Success',
            result: dbData.docs.map(doc=>doc.data())
        });
    } catch (error) {
        console.error(error)
        return res.status(400).send(error);
    }
}

// Method to update profile...
async function UpdateProfile(req, res) {
    try {
        let obj = {
            firstName: req.body.firstName ? req.body.firstName : '',
            lastName: req.body.lastName ? req.body.lastName : '',
            uid: req.body.uid
        }
        if(req.body.imageUrl){
            obj.imageUrl = req.body.imageUrl;
        }

        await db.collection("usersProfile").doc(req.body.uid).update(obj, {
            merge: true
        }).then(result => {
            console.log('Success response : ', res);
            res.status(200).send({
                message: 'Success',
                info: result,
            });
        }).catch(err => {
            console.log('Error in saving render Image metadata:', err);
            return res.status(400).send(err);

        });
    } catch (error) {
        console.error(error)
        return res.status(400).send(error);
    }
}

// Get user profile getUserProfile
async function getUserProfile(req, res) {
    try {
        if(!req.query.uid){
            return res.status(400).send({"error":"user id not available"});    
        }
        const dbData = await db.collection("usersProfile").doc().child("uid").equalto(req.query.uid).get(); //db.collection("appointments").doc().collection("clients").get(); 
        // dbData.docs.map(doc=>doc.data());
        console.log(dbData,'this fetched data---');
        res.status(200).send({
            message: 'Success',
            result: dbData.data() //dbData.docs.map(doc=>doc.data())
        });
    } catch (error) {
        console.error(error)
        return res.status(400).send(error);
    }
}

async function stripeCharge(req,res){
    try{
        functions.database
        .ref('/payments/{userId}/{paymentId}')
        .onWrite(event => {
            console.log('request received-----');
            console.log(event,'event-----');
            const payment = event.data.val();
            const userId = event.params.userId;
            const paymentId = event.params.paymentId;
    
    
            // checks if payment exists or if it has already been charged
            if (!payment || payment.charge) return;
    
            return admin.database()
                .ref(`/users/${userId}`)
                .once('value')
                .then(snapshot => {
                    return snapshot.val();
                })
                .then(customer => {
    
                    const amount = payment.amount;
                    const idempotency_key = paymentId; // prevent duplicate charges
                    const source = payment.token.id;
                    const currency = 'usd';
                    const charge = {
                        amount,
                        currency,
                        source
                    };
    
    
                    return stripe.charges.create(charge, {
                        idempotency_key
                    });
    
                })
    
                .then(charge => {
                    admin.database()
                        .ref(`/payments/${userId}/${paymentId}/charge`)
                        .set(charge)
                        return charge
    
                })
        });

    } catch(error){
        console.error(error)
        return res.status(400).send(error);
    }
}


// Add Client 
app.post('/add-client', (req, res) => {

    try {
        addClient(req, res);
    } catch (e) {
        console.log(e);
        send(res, 500, {
            error: `The server received an unexpected error. Please try again and contact the site admin if the error persists.`,
        });
    }
});

//Client List
app.get('/client-list', (req, res) => {
    try {
        clientList(req, res);
    } catch (e) {
        console.log(e);
        send(res, 500, {
            error: `The server received an unexpected error. Please try again and contact the site admin if the error persists.`,
        });
    }
});

// Scheduel Appointment
app.post('/schedule-appointment', (req, res) => {
    try {
        ScheduleAppointment(req, res);
    } catch (e) {
        console.log(e);
        send(res, 500, {
            error: `The server received an unexpected error. Please try again and contact the site admin if the error persists.`,
        });
    }
});

// AppointmentList
app.get('/appointment-list', (req, res) => {
    try {
        appointmentList(req, res);
    } catch (e) {
        console.log(e);
        send(res, 500, {
            error: `The server received an unexpected error. Please try again and contact the site admin if the error persists.`,
        });
    }
});

//  Update profile
app.post('/update-profile', (req, res) => {
    try {
        UpdateProfile(req, res);
    } catch (e) {
        console.log(e);
        send(res, 500, {
            error: `The server received an unexpected error. Please try again and contact the site admin if the error persists.`,
        });
    }
});

// AppointmentList
app.get('/get-user-profile', (req, res) => {
    try {
        getUserProfile(req, res);
    } catch (e) {
        console.log(e);
        send(res, 500, {
            error: `The server received an unexpected error. Please try again and contact the site admin if the error persists.`,
        });
    }
});

// stripe charge...
app.post('/stripeCharge', (req, res) => {
    try {
        stripeCharge(req, res);
    } catch (e) {
        console.log(e);
        send(res, 500, {
            error: `The server received an unexpected error. Please try again and contact the site admin if the error persists.`,
        });
    }
 });


const appointmentApp = functions.https.onRequest(app);

module.exports = {
    appointmentApp
}

