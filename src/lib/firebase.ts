import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  enableIndexedDbPersistence, 
  collection, 
  addDoc, 
  onSnapshot, 
  doc, 
  updateDoc,
  increment
} from 'firebase/firestore';

// Replace these with your actual Firebase config from the Firebase Console
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "YOUR_API_KEY",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "YOUR_AUTH_DOMAIN",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "YOUR_PROJECT_ID",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "YOUR_STORAGE_BUCKET",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "YOUR_SENDER_ID",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Enable offline persistence (Crucial requirement)
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === 'failed-precondition') {
    console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
  } else if (err.code === 'unimplemented') {
    console.warn('The current browser does not support all of the features required to enable persistence');
  }
});

// --- Patient Triage Module ---
export const addPatient = async (patientData: any) => {
  try {
    const docRef = await addDoc(collection(db, 'patients'), patientData);
    return docRef.id;
  } catch (e) {
    console.error("Error adding document: ", e);
    throw e;
  }
};

// --- Inventory Management Module ---
export const subscribeToInventory = (callback: (data: any[]) => void) => {
  const unsubscribe = onSnapshot(collection(db, 'inventory'), (snapshot) => {
    const inventory: any[] = [];
    snapshot.forEach((doc) => {
      inventory.push({ id: doc.id, ...doc.data() });
    });
    callback(inventory);
  });
  return unsubscribe;
};

export const prescribeMedicine = async (medicineId: string, amount: number) => {
  const medicineRef = doc(db, 'inventory', medicineId);
  await updateDoc(medicineRef, {
    current_stock: increment(-amount),
    last_updated: new Date().toISOString()
  });
};

// --- Staff Attendance Module ---
export const subscribeToStaff = (callback: (data: any[]) => void) => {
  const unsubscribe = onSnapshot(collection(db, 'attendance'), (snapshot) => {
    const staff: any[] = [];
    snapshot.forEach((doc) => {
      staff.push({ id: doc.id, ...doc.data() });
    });
    callback(staff);
  });
  return unsubscribe;
};

export const updateStaffAttendance = async (staffId: string, status: string) => {
  const staffRef = doc(db, 'attendance', staffId);
  await updateDoc(staffRef, {
    status: status,
    check_in_time: new Date().toISOString()
  });
};

export { db };
