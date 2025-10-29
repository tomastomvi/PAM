// Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyDc2Cp2vWmrWRz24Ab_81iNiH8FA9Ti7Zg",
    authDomain: "calco-ba4b3.firebaseapp.com",
    projectId: "calco-ba4b3",
    storageBucket: "calco-ba4b3.firebasestorage.app",
    messagingSenderId: "604462263549",
    appId: "1:604462263549:web:d325fb6fbaa82c7fe32294",
    measurementId: "G-9MXT9CX96N"
  };

  // Initialize Firebase
  window.Fbapp = initializeApp(firebaseConfig);
  const analytics = getAnalytics(Fbapp);
  console.log(window.Fbapp);
