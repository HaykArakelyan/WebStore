import { initializeApp } from "firebase/app";
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
    apiKey: "AIzaSyAAyds3swcOuA-MSTgCCus3qq1GT614KnE",
    authDomain: "webstore-da4c2.firebaseapp.com",
    projectId: "webstore-da4c2",
    storageBucket: "webstore-da4c2.appspot.com",
    messagingSenderId: "220262781211",
    appId: "1:220262781211:web:bce4cf40a49118ce3d83be"
};


const app = initializeApp(firebaseConfig);
export const storage = getStorage(app)