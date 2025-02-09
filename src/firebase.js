import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDzfj-FvDIseA1J8MnMiNzNkOhE8P-3seI",
  authDomain: "playnx-eb90b.firebaseapp.com",
  projectId: "playnx-eb90b",
  storageBucket: "playnx-eb90b.appspot.com",
  messagingSenderId: "1019372509465",
  appId: "1:1019372509465:web:2bc3a5c1c4460e62134d88",
  measurementId: "G-YGHMK7LG7K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export { auth, googleProvider };
