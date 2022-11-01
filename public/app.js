const auth = firebase.auth();

const whenSignedIn = document.getElementById('whenSignedIn');
const whenSignedOut = document.getElementById('whenSignedOut');

const signInBtn = document.getElementById('signInBtn');
const signOutBtn = document.getElementById('signOutBtn');

const userDetails = document.getElementById('userDetails');

const provider = new firebase.auth.GoogleAuthProvider();

const createThing = document.getElementById('createThing');
const thingsList = document.getElementById('thingsList');

signInBtn.onclick = () => auth.signInWithPopup(provider);

signOutBtn.onclick = () => auth.signOut();

auth.onAuthStateChanged(user => {
    if (user) {
        thingsRef = db.collection('things')
        createThing.onclick = () => {
            const { serverTimestamp } = firebase.firestore.FieldValue;
            thingsRef.add({
                uid: user.uid,
                name: faker.commerce.productName(),
                createdAt: serverTimestamp()
            });}
        whenSignedIn.hidden = false;
        whenSignedOut.hidden = true;
        thingsList.hidden = false;
        createThing.hidden = false
        userDetails.innerHTML = `<h3>Hello ${user.displayName}!</h3> 
        <p>User ID: ${user.uid}</p>`;

    } else {
        whenSignedIn.hidden = true;
        whenSignedOut.hidden = false;
        userDetails.innerHTML = ``;
        createThing.hidden = true;
        thingsList.hidden = true;
    }
});

const db = firebase.firestore()

let thingsRef;
let unsubscribe;
auth.onAuthStateChanged(user => {
    if (user) {
        // Database Reference
        thingsRef = db.collection('things')
        createThing.onclick = () => {
            const { serverTimestamp } = firebase.firestore.FieldValue;
            thingsRef.add({
                uid: user.uid,
                name: faker.commerce.productName(),
                createdAt: serverTimestamp()
            });
        }
        // Query
        unsubscribe = thingsRef
            .where('uid', '==', user.uid)
            .orderBy('createdAt') // Requires a query
            .onSnapshot(querySnapshot => {
                // Map results to an array of li elements
                const items = querySnapshot.docs.map(doc => {
                    return `<table style="width:50%; border: 1.5px solid #000000;">
                    <tr>
                        <th style="border: 1.5px solid #000000; width:30%;">${doc.data().name}</th>
                        <th>${doc.data().createdAt.toDate().toDateString()}</th>
                    </tr>
                    </table>`
                });
                thingsList.innerHTML = items.join('');
            });
    } else {
        // Unsubscribe when the user signs out
        unsubscribe && unsubscribe();
    }
});