import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getFirestore } from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyBOz0OAB-X_-WS56CKrGE678DfmkmAdv5U',
  authDomain: 'medibox-bcf65.firebaseapp.com',
  databaseURL: 'https://medibox-bcf65-default-rtdb.firebaseio.com',
  projectId: 'medibox-bcf65',
  storageBucket: 'medibox-bcf65.appspot.com',
  messagingSenderId: '887339504905',
  appId: '1:887339504905:web:ce2af2c6afc45028db2fd8',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
export const db = getFirestore(app);
// export default database;
// export default db;

