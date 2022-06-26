// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCgFw-VUE3x-_3lJzTqqvMOD4I2xt4lVCk",
  authDomain: "memory-7dc6f.firebaseapp.com",
  databaseURL: "https://memory-7dc6f-default-rtdb.firebaseio.com",
  projectId: "memory-7dc6f",
  storageBucket: "memory-7dc6f.appspot.com",
  messagingSenderId: "518945139239",
  appId: "1:518945139239:web:a1309e49c9742d14fffc02"
};

// Initialize Firebase
const firebase = initializeApp(firebaseConfig);

export default firebase;
