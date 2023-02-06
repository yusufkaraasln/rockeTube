 
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDURm49Ea_E7x8EYSPKGM9gCHDZK6LcSLo",
  authDomain: "rocketube-ca6ce.firebaseapp.com",
  projectId: "rocketube-ca6ce",
  storageBucket: "rocketube-ca6ce.appspot.com",
  messagingSenderId: "430980904214",
  appId: "1:430980904214:web:5b78e02e6664ade631cc37",
  measurementId: "G-13F3X2DR81",
};

const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export default app;


