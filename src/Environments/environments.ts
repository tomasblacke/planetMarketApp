import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

export const firebaseConfig = {
    apiKey: "AIzaSyDxsipz_A5rMcbi3kixLmoPPFkiEiyh7nw",
    authDomain: "planet-market-app.firebaseapp.com",
    projectId: "planet-market-app",
    storageBucket: "planet-market-app.firebasestorage.app",
    messagingSenderId: "488496704279",
    appId: "1:488496704279:web:ec51d97ebf301b49abe552",
    measurementId: "G-B8R59LJY19"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);