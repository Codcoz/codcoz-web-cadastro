import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAboQtPmA5_2MU-dU-ZKksEnvGAh9n8qTQ",
  authDomain: "codcoz.firebaseapp.com",
  projectId: "codcoz",
  storageBucket: "codcoz.firebasestorage.app",
  messagingSenderId: "373303387952"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Inicializa os serviços
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
