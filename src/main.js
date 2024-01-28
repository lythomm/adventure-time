import { createApp } from "vue";
import "./style.css";
import { initializeApp } from "firebase/app";
import App from "./App.vue";

const firebaseConfig = {
  apiKey: "AIzaSyD7mYndwLT2dZR2Xq9yGJDfVWAlsGfkk4s",
  authDomain: "adventuretime-8fe96.firebaseapp.com",
  databaseURL:
    "https://adventuretime-8fe96-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "adventuretime-8fe96",
  storageBucket: "adventuretime-8fe96.appspot.com",
  messagingSenderId: "461508649927",
  appId: "1:461508649927:web:5478b4386beac6ea16efe2",
};

const app = createApp(App);

// Initialize Firebase
initializeApp(firebaseConfig);
// initializeApp(firebaseConfig);

app.mount("#app");
