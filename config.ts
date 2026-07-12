import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: 'AIzaSyDkZ4R9b1aiSE3a8Hv_aenQdtulMbIbIQw',
  authDomain: 'mr-earning-a806d.firebaseapp.com',
  databaseURL: 'https://mr-earning-a806d-default-rtdb.firebaseio.com',
  projectId: 'mr-earning-a806d',
  storageBucket: 'mr-earning-a806d.firebasestorage.app',
  messagingSenderId: '139526163112',
  appId: '1:139526163112:web:eada4fcdf54a815bb6d09d',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app);
export default app;
