const functions = require('firebase-functions');

exports.stripeCharge = functions.firestore
    .document('payment/{paymentId}')
    .onCreate((snap, context) => {
        const newPayment = snap.data();

        if (!newPayment || !newPayment.charge) {
            return;
        }

        if (newPayment.charge) {
            return;
        }

        const paymentId = context.params.paymentId;

        const amount = newPayment.amount;
        const idempotency_key = paymentId;  // prevent duplicate charges
        const source = newPayment.token.id;
        const currency = 'CHF';
        const charge = { amount, currency, source };

        stripe.charges.create(charge, { idempotency_key }).then(pCharge => {
            return snap.ref.set({ pCharge }, { merge: true });
        });
    });


// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
