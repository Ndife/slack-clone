import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/storage";

  var firebaseConfig = {
    apiKey: "AIzaSyAEJMAcLPDWsYfBTuXzPzCX4OU65hTesPc",
    authDomain: "slack-clone-4e224.firebaseapp.com",
    databaseURL: "https://slack-clone-4e224.firebaseio.com",
    projectId: "slack-clone-4e224",
    storageBucket: "slack-clone-4e224.appspot.com",
    messagingSenderId: "376439141977",
    appId: "1:376439141977:web:90fb1b93af7c81bf66e348",
    measurementId: "G-QPE23PL24P"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

export default firebase;
