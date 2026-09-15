import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore, collection, getDocs, doc, setDoc } from 'firebase/firestore';
import { PRJob } from '../types';

let appInstance: FirebaseApp | null = null;
let dbInstance: Firestore | null = null;

export function initializeFirebaseWithConfig(config: {
  apiKey?: string;
  authDomain?: string;
  projectId?: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
}): { success: boolean; message: string } {
  try {
    if (!config.apiKey || !config.projectId) {
      return { success: false, message: 'กรุณากรอก Firebase API Key และ Project ID ให้ครบถ้วน' };
    }

    if (getApps().length === 0) {
      appInstance = initializeApp(config);
    } else {
      appInstance = getApps()[0];
    }
    dbInstance = getFirestore(appInstance);
    return { success: true, message: 'เชื่อมต่อ Firebase Firestore สำเร็จเรียบร้อย' };
  } catch (err) {
    return { success: false, message: 'การเชื่อมต่อ Firebase ล้มเหลว: ' + (err instanceof Error ? err.message : String(err)) };
  }
}

export function isFirebaseReady(): boolean {
  return dbInstance !== null;
}

export async function syncJobsToFirestore(jobs: PRJob[]): Promise<{ success: boolean; message: string }> {
  if (!dbInstance) {
    return { success: false, message: 'ยังไม่ได้เชื่อมต่อ Firebase หรือไม่ได้กำหนดค่า Config' };
  }
  try {
    const colRef = collection(dbInstance, 'pr_jobs');
    for (const job of jobs) {
      await setDoc(doc(colRef, job.id), job, { merge: true });
    }
    return { success: true, message: `อัปโหลดงาน ${jobs.length} รายการขึ้น Firestore สำเร็จ` };
  } catch (error) {
    return { success: false, message: 'เกิดข้อผิดพลาดในการบันทึกขึ้น Firestore: ' + (error instanceof Error ? error.message : String(error)) };
  }
}

export async function fetchJobsFromFirestore(): Promise<{ success: boolean; jobs: PRJob[]; message: string }> {
  if (!dbInstance) {
    return { success: false, jobs: [], message: 'ยังไม่ได้เชื่อมต่อ Firebase' };
  }
  try {
    const querySnapshot = await getDocs(collection(dbInstance, 'pr_jobs'));
    const fetched: PRJob[] = [];
    querySnapshot.forEach((docSnap) => {
      fetched.push(docSnap.data() as PRJob);
    });
    return { success: true, jobs: fetched, message: `ดึงข้อมูลจาก Firestore สำเร็จ ${fetched.length} รายการ` };
  } catch (error) {
    return { success: false, jobs: [], message: 'ไม่สามารถดึงข้อมูลจาก Firestore ได้: ' + (error instanceof Error ? error.message : String(error)) };
  }
}
