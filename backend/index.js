// IMPORTANTE: Debes asegurarte de que el servidor Express esté sirviendo archivos estáticos desde el directorio 'frontend' en la ruta '/frontend'
// También debes asegurarte de haber instalado las dependencias de Express y Firebase antes de ejecutar el servidor (ejecuta 'npm install express firebase' en la carpeta del backend)

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore/lite';
import express from 'express';

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};
const appFirebase = initializeApp(firebaseConfig);
const db = getFirestore(appFirebase);

const app = express();
const port = 3000;

app.use(express.json());

// read all students
app.get("/api/read", async (req, res) => {
    try {
        const querySnapshot = await getDocs(collection(db, "students"));
        let response = [];
        querySnapshot.forEach((doc) => {
            const selectedItem = {
                id: doc.id,
                student: doc.data(),
            };
            response.push(selectedItem);
        });
        return res.status(200).send(response);
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
});

// create student
app.post("/api/create", async (req, res) => {
    try {
        const docRef = await addDoc(collection(db, "students"), req.body.student);
        return res.status(200).send(`Document written with ID:  ${docRef.id}`);
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
});

// update
app.put("/api/update/:item_id", async (req, res) => {
    try {
        const studentDocumentId = doc(db, "students", req.params.item_id);
        await updateDoc(studentDocumentId, req.body.student);
        return res.status(200).send(`Document update`);
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
});

// delete
app.delete("/api/delete/:item_id", async (req, res) => {
    try {
        await deleteDoc(doc(db, "students", req.params.item_id));
        return res.status(200).send(`Student successfully deleted`);
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
});

app.listen(port, () => {
    console.log(`WebApi listening on port ${port}`);
});
