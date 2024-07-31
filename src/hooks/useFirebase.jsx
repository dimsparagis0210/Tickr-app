import {initializeApp} from "firebase/app";
import {getDatabase} from "firebase/database";

export const useFirebase = () => {
    const firebaseConfig = {
        databaseURL: "https://to-do-cosmos-default-rtdb.europe-west1.firebasedatabase.app/",
    };
    const app = initializeApp(firebaseConfig);
    const db = getDatabase(app);

    return db;
}