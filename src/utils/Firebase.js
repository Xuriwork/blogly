import firebase from '@firebase/app';
import '@firebase/firestore';
import '@firebase/auth';
import '@firebase/storage';
import '@firebase/performance';

export const firebaseConfig = {
    apiKey: "AIzaSyD6XOMzFR2aUtJGmqy5C3r4Eu_C4L5Pl9g",
    authDomain: "blogly-xuri.firebaseapp.com",
    databaseURL: "https://blogly-xuri.firebaseio.com",
    projectId: "blogly-xuri",
    storageBucket: "blogly-xuri.appspot.com",
    messagingSenderId: "326450340995",
    appId: "1:326450340995:web:96c99d3b19b6696e1ce7b6",
    measurementId: "G-T5LP4QP26P"
};


firebase.initializeApp(firebaseConfig);
firebase.performance();

export const auth = firebase.auth();
export const firestore = firebase.firestore();

export default firebase;