// FIX: The original `import { initializeApp } from 'firebase/app'` was causing a module resolution error.
// Switched to using the Firebase compat library for initialization (`firebase/compat/app`).
// This provides a robust workaround as the returned `FirebaseApp` object is compatible
// with the v9 modular API used throughout the rest of the application.
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';
import { getFirestore } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// 1. CONFIG: Your actual configuration
const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  databaseURL: "",
  projectId: "",
  storageBucket: "", // This is your default bucket
  messagingSenderId: "",
  appId: "",
  measurementId: ""
};

// 2. INITIALIZE: Use compat initializeApp to work around potential environment issues.
// Added a check to prevent re-initialization during hot module reloading.
const app = !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();

// 3. EXPORTS: Connect to your specific resources

// Connect to the specific named database "vibe-coding"
export const db = getFirestore(app, "vibe-coding");

// Connect to the default storage bucket
export const storage = getStorage(app);

/**
 * Uploads a file to the 'vibe-coding' folder in Storage.
 * @param file The file object from the input.
 * @returns The public download URL of the uploaded image.
 */
export const uploadImage = async (file: File): Promise<string> => {
  if (!file) throw new Error("No file provided");

  // Create a unique filename to prevent overwrites
  const fileName = `${Date.now()}_${file.name}`;
  
  // Create a reference to 'vibe-coding/YOUR_FILE_NAME'
  // This automatically creates the folder if it doesn't exist
  const storageRef = ref(storage, `vibe-coding/${fileName}`);

  // Upload the file
  const snapshot = await uploadBytes(storageRef, file);

  // Get and return the download URL
  return await getDownloadURL(snapshot.ref);
};
