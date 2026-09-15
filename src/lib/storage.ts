import { PRJob, SystemConfig } from '../types';
import { INITIAL_JOBS, INITIAL_CONFIG } from '../data/seedData';

const STORAGE_KEY_JOBS = 'pr_system_jobs_v1';
const STORAGE_KEY_CONFIG = 'pr_system_config_v1';

export function getStoredJobs(): PRJob[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_JOBS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_JOBS, JSON.stringify(INITIAL_JOBS));
      return INITIAL_JOBS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_JOBS;
  } catch (error) {
    console.error('Error reading jobs from local file-base storage:', error);
    return INITIAL_JOBS;
  }
}

export function saveStoredJobs(jobs: PRJob[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_JOBS, JSON.stringify(jobs));
  } catch (error) {
    console.error('Error saving jobs to local storage:', error);
  }
}

export function getStoredConfig(): SystemConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CONFIG);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(INITIAL_CONFIG));
      return INITIAL_CONFIG;
    }
    return { ...INITIAL_CONFIG, ...JSON.parse(raw) };
  } catch (error) {
    console.error('Error reading config:', error);
    return INITIAL_CONFIG;
  }
}

export function saveStoredConfig(config: SystemConfig): void {
  try {
    localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(config));
  } catch (error) {
    console.error('Error saving config:', error);
  }
}

/**
 * Download complete database as formatted JSON file (File-base database export)
 */
export function exportDatabaseToFile(): void {
  const jobs = getStoredJobs();
  const config = getStoredConfig();
  const exportPayload = {
    system: 'PR SYSTEM - ระบบบริการงานประชาสัมพันธ์',
    version: '1.0.0',
    exportDate: new Date().toISOString(),
    totalRecords: jobs.length,
    config,
    jobs
  };

  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportPayload, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `pr_system_database_${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

/**
 * Import database from user-provided JSON file
 */
export async function importDatabaseFromFile(file: File): Promise<{ success: boolean; message: string; count: number }> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const parsed = JSON.parse(text);

        let incomingJobs: PRJob[] = [];
        if (Array.isArray(parsed)) {
          incomingJobs = parsed;
        } else if (parsed && Array.isArray(parsed.jobs)) {
          incomingJobs = parsed.jobs;
          if (parsed.config) {
            saveStoredConfig(parsed.config);
          }
        } else {
          resolve({ success: false, message: 'รูปแบบไฟล์ JSON ไม่ถูกต้องสำหรับระบบ PR', count: 0 });
          return;
        }

        saveStoredJobs(incomingJobs);
        resolve({
          success: true,
          message: `นำเข้าข้อมูลงานประชาสัมพันธ์สำเร็จทั้งหมด ${incomingJobs.length} รายการ`,
          count: incomingJobs.length
        });
      } catch (err) {
        resolve({ success: false, message: 'เกิดข้อผิดพลาดในการอ่านไฟล์ JSON: ' + (err instanceof Error ? err.message : String(err)), count: 0 });
      }
    };
    reader.onerror = () => {
      resolve({ success: false, message: 'ไม่สามารถอ่านไฟล์ได้', count: 0 });
    };
    reader.readAsText(file);
  });
}

/**
 * Reset data back to initial seed data
 */
export function resetDatabaseToSeed(): PRJob[] {
  localStorage.setItem(STORAGE_KEY_JOBS, JSON.stringify(INITIAL_JOBS));
  localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(INITIAL_CONFIG));
  return INITIAL_JOBS;
}
