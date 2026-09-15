export type ServiceCategory = 
  | 'poster'       // ออกแบบโปสเตอร์ / แบนเนอร์ / Infographic / Backdrop
  | 'photography'  // ถ่ายภาพนิ่ง / วิดีโอบันทึกภาพงาน / ถ่ายทอดสด
  | 'facebook_pr'  // ข่าวประชาสัมพันธ์ Facebook / เว็บไซต์ / สื่อมวลชน
  | 'mc_event'     // งานพิธีกร / งานแถลงข่าว / ประสานงานสื่อ
  | 'print_media'  // สื่อสิ่งพิมพ์ วารสาร แผ่นพับ จดหมายข่าว
  | 'other';       // งานประชาสัมพันธ์อื่นๆ

export type JobStatus = 
  | 'pending'      // 1. รับเรื่อง / รอดำเนินการ
  | 'in_progress'  // 2. กำลังจัดทำ
  | 'review'       // 3. รอตรวจทาน / แก้ไข
  | 'delivered'    // 4. ส่งมอบ / เผยแพร่แล้ว
  | 'completed';   // 5. เสร็จสมบูรณ์

export type PriorityLevel = 'normal' | 'urgent' | 'urgent_critical';

export interface ActivityLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  note?: string;
}

export interface PRJob {
  id: string;
  jobCode: string; // e.g. "PR-2026-001"
  title: string;
  category: ServiceCategory;
  department: string;
  requesterName: string;
  requesterContact: string; // เบอร์โทร / LINE ID
  requestDate: string; // YYYY-MM-DD
  deadlineDate: string; // YYYY-MM-DD
  eventDate?: string; // วันที่จัดงาน (กรณีถ่ายภาพ/อีเวนต์)
  location?: string; // สถานที่จัดงาน
  priority: PriorityLevel;
  status: JobStatus;
  description: string;
  
  // Specific requirements
  dimensionOrFormat?: string; // ขนาด เช่น 1920x1080, A3, Facebook Post 1:1, Reel 9:16
  targetAudience?: string; // กลุ่มเป้าหมาย เช่น นักศึกษา, ประชาชนทั่วไป, บุคลากรภายใน
  referenceLinks?: string; // ลิงก์ตัวอย่าง หรือ โฟลเดอร์ Google Drive
  deliverableLink?: string; // ลิงก์ไฟล์งานที่เสร็จแล้ว (Drive/Canva/Cloud)
  
  // PR Staff Assignment
  assignedOfficer?: string; // ผู้รับผิดชอบ (นักประชาสัมพันธ์)
  progressPercentage: number; // 0 - 100
  
  // Performance & Feedback
  reachImpressions?: number; // สถิติ Reach / Engagement (กรณีลงข่าว FB)
  satisfactionRating?: number; // 1-5 ดาว
  completionDate?: string; // วันที่ปิดงาน
  
  // Logs
  logs: ActivityLog[];
}

export interface LineNotificationConfig {
  enabled: boolean;
  notifyToken?: string; // LINE Notify Token
  webhookUrl?: string; // LINE Webhook / Messaging API endpoint
  targetChannelName: string; // เช่น "กลุ่มงานประชาสัมพันธ์ & การตลาด"
  notifyOnNewRequest: boolean;
  notifyOnStatusChange: boolean;
  notifyOnCompletion: boolean;
  notifyOnUrgent: boolean;
}

export interface MonthlyPRSummary {
  yearMonth: string; // "2026-09"
  totalJobs: number;
  completedJobs: number;
  inProgressJobs: number;
  urgentJobs: number;
  completionRate: number; // percentage
  avgTurnaroundDays: number;
  totalReach: number;
  categoryBreakdown: Record<ServiceCategory, number>;
  statusBreakdown: Record<JobStatus, number>;
  topDepartments: { name: string; count: number }[];
  highlightJobs: PRJob[];
  aiExecutiveSummary: string;
}

export interface SystemConfig {
  theme: 'light' | 'dark';
  organizationName: string;
  prDepartmentName: string;
  lineConfig: LineNotificationConfig;
  firebaseConfig?: {
    apiKey?: string;
    authDomain?: string;
    projectId?: string;
    storageBucket?: string;
    messagingSenderId?: string;
    appId?: string;
    isConnected: boolean;
  };
}
