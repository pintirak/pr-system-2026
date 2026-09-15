import { PRJob, SystemConfig, ServiceCategory, JobStatus, PriorityLevel } from '../types';

export const INITIAL_JOBS: PRJob[] = [
  {
    id: 'pr-job-001',
    jobCode: 'PR-2026-0901',
    title: 'ออกแบบโปสเตอร์และแบนเนอร์ประชาสัมพันธ์งานสัปดาห์นวัตกรรมและเทคโนโลยี 2026',
    category: 'poster',
    department: 'คณะวิทยาศาสตร์และเทคโนโลยี',
    requesterName: 'อาจารย์ ดร.กิตติศักดิ์ ศรีสุข',
    requesterContact: '081-234-5678 (LINE: dr_kitti)',
    requestDate: '2026-09-02',
    deadlineDate: '2026-09-18',
    eventDate: '2026-09-25',
    location: 'หอประชุมใหญ่ อาคารนวัตกรรม',
    priority: 'urgent',
    status: 'in_progress',
    description: 'ต้องการโปสเตอร์ขนาด A3 สำหรับบอร์ดประชาสัมพันธ์ และ Banner แนวนอน 1200x630 สำหรับโปรโมทบน Facebook Page โทนสีฟ้า-น้ำเงินสไตล์ Modern Tech เน้นหัวข้อ Future AI & Innovation',
    dimensionOrFormat: 'A3 (Print 300dpi) + Facebook Banner 1200x630px',
    targetAudience: 'นักศึกษา บุคลากร และบุคคลภายนอกที่สนใจเทคโนโลยี',
    referenceLinks: 'https://drive.google.com/drive/folders/sample-pr-ref-01',
    deliverableLink: 'https://www.canva.com/design/sample-draft-pr01',
    assignedOfficer: 'คุณพัชราภรณ์ (นักประชาสัมพันธ์ชำนาญการ)',
    progressPercentage: 65,
    reachImpressions: 0,
    logs: [
      {
        id: 'log-1',
        timestamp: '2026-09-02 09:30',
        user: 'ดร.กิตติศักดิ์ (ผู้ขอรับบริการ)',
        action: 'ส่งคำขอรับบริการผ่านระบบ PR SYSTEM',
        note: 'แนบไฟล์ร่างเนื้อหากำหนดการเรียบร้อยแล้ว'
      },
      {
        id: 'log-2',
        timestamp: '2026-09-02 11:15',
        user: 'คุณพัชราภรณ์ (ฝ่าย ปชส.)',
        action: 'รับเรื่องและอนุมัติเข้าสู่กระบวนการออกแบบ',
        note: 'กำหนดส่งดราฟท์แรกวันที่ 10 ก.ย.'
      },
      {
        id: 'log-3',
        timestamp: '2026-09-10 16:45',
        user: 'คุณพัชราภรณ์ (ฝ่าย ปชส.)',
        action: 'ส่งแบบร่างที่ 1 ให้ผู้ขอตรวจทาน',
        note: 'ผู้ขอขอปรับตำแหน่งโลโก้ผู้สนับสนุนหลัก'
      }
    ]
  },
  {
    id: 'pr-job-002',
    jobCode: 'PR-2026-0902',
    title: 'ถ่ายภาพนิ่งและบันทึกวิดีโอพิธีลงนามบันทึกข้อตกลงความร่วมมือทางวิชาการ (MOU)',
    category: 'photography',
    department: 'กองวิเทศสัมพันธ์และเครือข่าย',
    requesterName: 'คุณมัลลิกา ทองคำ',
    requesterContact: '089-987-6543 (LINE: mallika_ir)',
    requestDate: '2026-09-05',
    deadlineDate: '2026-09-16',
    eventDate: '2026-09-15',
    location: 'ห้องประชุมสารนิเทศ ชั้น 3 อาคารอำนวยการ',
    priority: 'urgent_critical',
    status: 'delivered',
    description: 'บันทึกภาพถ่ายบรรยากาศพิธีลงนาม MOU ระหว่างหน่วยงานกับพันธมิตรต่างประเทศ พร้อมคัดเลือกภาพไฮไลท์ 10 ภาพทันทีหลังจบงานสำหรับข่าวเร่งด่วน',
    dimensionOrFormat: 'ภาพ RAW + JPEG ความละเอียดสูง (ส่ง Google Drive)',
    targetAudience: 'ผู้บริหาร แขกผู้มีเกียรติ และสื่อมวลชน',
    referenceLinks: 'https://drive.google.com/drive/folders/mou-schedule-2026',
    deliverableLink: 'https://drive.google.com/drive/folders/mou-photos-selected-2026',
    assignedOfficer: 'คุณเอกชัย (ช่างภาพประชาสัมพันธ์)',
    progressPercentage: 90,
    reachImpressions: 4200,
    logs: [
      {
        id: 'log-4',
        timestamp: '2026-09-05 14:00',
        user: 'คุณมัลลิกา (กองวิเทศฯ)',
        action: 'ส่งคำขอบริการถ่ายภาพงาน MOU',
        note: 'แจ้งความประสงค์ช่างภาพ 2 ท่าน'
      },
      {
        id: 'log-5',
        timestamp: '2026-09-15 13:00',
        user: 'คุณเอกชัย (ช่างภาพ ปชส.)',
        action: 'เข้าบันทึกภาพงานตามกำหนดการ',
        note: 'บันทึกภาพเสร็จสิ้น กำลังคัดเลือกและปรับแต่งโทนภาพ'
      },
      {
        id: 'log-6',
        timestamp: '2026-09-15 17:30',
        user: 'คุณเอกชัย (ช่างภาพ ปชส.)',
        action: 'ส่งมอบภาพถ่ายไฮไลท์ชุดแรก',
        note: 'อัปโหลดภาพชุดด่วน 20 ภาพขึ้นไดรฟ์เรียบร้อย'
      }
    ]
  },
  {
    id: 'pr-job-003',
    jobCode: 'PR-2026-0903',
    title: 'เรียบเรียงและเผยแพร่ข่าวประชาสัมพันธ์ Facebook: โครงการจิตอาสาพัฒนาชุมชนรอบรั้ว',
    category: 'facebook_pr',
    department: 'กองพัฒนานักศึกษาและกิจกรรม',
    requesterName: 'คุณวราพร รุ่งเรือง',
    requesterContact: '085-333-2211',
    requestDate: '2026-09-08',
    deadlineDate: '2026-09-12',
    eventDate: '2026-09-07',
    location: 'ชุมชนริมคลองสัมพันธ์',
    priority: 'normal',
    status: 'completed',
    description: 'เขียนแคปชันข่าวสรุปกิจกรรมจิตอาสา ร้อยเรียงเรื่องราวความประทับใจ พร้อมจัดเรียงอัลบั้มภาพ 15 ภาพ เผยแพร่ผ่านทาง Facebook Official Fanpage',
    dimensionOrFormat: 'Facebook Album Layout (ภาพปก 1:1 + อัลบั้ม)',
    targetAudience: 'ผู้ติดตามเพจ ศิษย์เก่า และประชาชนทั่วไป',
    referenceLinks: 'https://facebook.com/org-news/activity-draft',
    deliverableLink: 'https://facebook.com/posts/volunteer-2026-september',
    assignedOfficer: 'คุณปิยดา (นักสื่อสารองค์กร)',
    progressPercentage: 100,
    reachImpressions: 18500,
    satisfactionRating: 5,
    completionDate: '2026-09-12',
    logs: [
      {
        id: 'log-7',
        timestamp: '2026-09-08 10:00',
        user: 'คุณวราพร (ผู้ขอ)',
        action: 'ส่งภาพถ่ายกิจกรรมและข้อมูลสรุปโครงการ',
        note: 'ขอให้ลงข่าวช่วงบ่ายของวันศุกร์'
      },
      {
        id: 'log-8',
        timestamp: '2026-09-11 15:00',
        user: 'คุณปิยดา (ฝ่าย ปชส.)',
        action: 'เขียนข่าวเสร็จสิ้นและส่งให้ผู้ตรวจยืนยัน',
        note: 'อนุมัติเรียบร้อยโดยหัวหน้างาน'
      },
      {
        id: 'log-9',
        timestamp: '2026-09-12 14:00',
        user: 'คุณปิยดา (ฝ่าย ปชส.)',
        action: 'เผยแพร่ข่าวบน Facebook สำเร็จ',
        note: 'ยอด Reach 18,500 และ 420 แชร์'
      }
    ]
  },
  {
    id: 'pr-job-004',
    jobCode: 'PR-2026-0904',
    title: 'ออกแบบ Infographic สรุปขั้นตอนการยื่นขอทุนการศึกษาและเงินกู้ กยศ. ประจำปี 2569',
    category: 'poster',
    department: 'งานแนะแนวและทุนการศึกษา',
    requesterName: 'คุณศศิธร บุญญา',
    requesterContact: '083-445-6677 (LINE: sasithorn_b)',
    requestDate: '2026-09-11',
    deadlineDate: '2026-09-22',
    location: 'เผยแพร่ออนไลน์และบอร์ดประชาสัมพันธ์',
    priority: 'urgent',
    status: 'review',
    description: 'ย่อยเนื้อหาประกาศ 8 หน้า ให้เหลือ Infographic เข้าใจง่าย 3 ตอน (Timeline ขั้นตอน, เอกสารที่ต้องเตรียม, ช่องทางส่งเอกสาร) ลายเส้นน่ารักเข้าใจง่าย',
    dimensionOrFormat: 'Infographic 1080x1350px (Instagram/FB Carousel) + A4 PDF',
    targetAudience: 'นักศึกษาทุกชั้นปี และผู้ปกครอง',
    referenceLinks: 'https://drive.google.com/scholarship-announcement-2026',
    deliverableLink: 'https://www.canva.com/design/infographic-scholarship-draft',
    assignedOfficer: 'คุณพัชราภรณ์ (นักประชาสัมพันธ์ชำนาญการ)',
    progressPercentage: 80,
    reachImpressions: 0,
    logs: [
      {
        id: 'log-10',
        timestamp: '2026-09-11 11:30',
        user: 'คุณศศิธร (งานทุนฯ)',
        action: 'ยื่นคำขอรับบริการออกแบบ Infographic',
        note: 'แนบเอกสารระเบียบการทุน'
      },
      {
        id: 'log-11',
        timestamp: '2026-09-14 17:00',
        user: 'คุณพัชราภรณ์ (ฝ่าย ปชส.)',
        action: 'ส่งดราฟท์ Infographic 3 หน้าให้ตรวจทาน',
        note: 'รอทางงานทุนตรวจสอบความถูกต้องของข้อความวันที่'
      }
    ]
  },
  {
    id: 'pr-job-005',
    jobCode: 'PR-2026-0905',
    title: 'จัดเตรียมพิธีกรและบันทึกถ่ายทอดสด Facebook Live งานเสวนาวิชาการระดับชาติ',
    category: 'mc_event',
    department: 'สถาบันวิจัยและพัฒนา',
    requesterName: 'ผศ.ดร.ประวิทย์ วงศ์สว่าง',
    requesterContact: '086-778-9900',
    requestDate: '2026-09-14',
    deadlineDate: '2026-09-28',
    eventDate: '2026-09-28',
    location: 'ห้องประชุม Convention Hall และ Streaming Studio',
    priority: 'normal',
    status: 'pending',
    description: 'ขอรับการสนับสนุนพิธีกรดำเนินรายการ 2 ท่าน (ภาษาไทย-อังกฤษ) และทีมงานถ่ายทอดสด Live Streaming ผ่านระบบ OBS ขึ้นเพจหลัก พร้อมมิกเซอร์เสียง',
    dimensionOrFormat: 'Facebook Live 1080p 60fps + บันทึกวิดีโอย้อนหลัง MP4',
    targetAudience: 'นักวิจัย คณาจารย์ และผู้ทรงคุณวุฒิ',
    referenceLinks: 'https://research-symposium-2026.org/agenda',
    assignedOfficer: 'คุณปิยดา (นักสื่อสารองค์กร)',
    progressPercentage: 15,
    reachImpressions: 0,
    logs: [
      {
        id: 'log-12',
        timestamp: '2026-09-14 09:15',
        user: 'ผศ.ดร.ประวิทย์ (สถาบันวิจัย)',
        action: 'ยื่นคำขอสนับสนุนงานพิธีกรและถ่ายทอดสด',
        note: 'รอการนัดประชุมสรุป Script พิธีกรสัปดาห์หน้า'
      }
    ]
  },
  {
    id: 'pr-job-006',
    jobCode: 'PR-2026-0815',
    title: 'จัดทำจดหมายข่าวอิเล็กทรอนิกส์ (E-Newsletter) และสื่อสิ่งพิมพ์ ประจำเดือนสิงหาคม',
    category: 'print_media',
    department: 'สำนักงานเลขานุการและประชาสัมพันธ์กลาง',
    requesterName: 'คุณนลินี วงศ์สมุทร',
    requesterContact: '081-555-7788',
    requestDate: '2026-08-15',
    deadlineDate: '2026-08-31',
    priority: 'normal',
    status: 'completed',
    description: 'รวบรวมข่าวสารและกิจกรรมเด่นในรอบเดือน จัดทำเป็นรูปเล่ม E-Newsletter 12 หน้า และพิมพ์แจกจ่ายตามหน่วยงาน 500 เล่ม',
    dimensionOrFormat: 'A4 Magazine Layout (InDesign / Interactive PDF)',
    targetAudience: 'คณะผู้บริหาร คณาจารย์ บุคลากร และเครือข่าย',
    deliverableLink: 'https://online.pubhtml5.com/pr-newsletter-aug2026',
    assignedOfficer: 'คุณพัชราภรณ์ (นักประชาสัมพันธ์ชำนาญการ)',
    progressPercentage: 100,
    reachImpressions: 6500,
    satisfactionRating: 5,
    completionDate: '2026-08-31',
    logs: [
      {
        id: 'log-13',
        timestamp: '2026-08-15 08:30',
        user: 'คุณนลินี',
        action: 'เปิดโครงการจัดทำวารสารประจำเดือน',
        note: 'รวบรวมบทความ 10 ข่าว'
      },
      {
        id: 'log-14',
        timestamp: '2026-08-31 16:00',
        user: 'คุณพัชราภรณ์',
        action: 'ส่งมอบเล่มเสร็จสมบูรณ์',
        note: 'อัปโหลดขึ้นคลังจดหมายข่าวเรียบร้อย'
      }
    ]
  }
];

export const INITIAL_CONFIG: SystemConfig = {
  theme: 'light',
  organizationName: 'ศูนย์บริการสื่อและประชาสัมพันธ์องค์กร',
  prDepartmentName: 'ฝ่ายประชาสัมพันธ์และสื่อสารองค์กร (PR Team)',
  lineConfig: {
    enabled: true,
    notifyToken: '',
    webhookUrl: '',
    targetChannelName: 'กลุ่มงานประชาสัมพันธ์ (PR Service Alert)',
    notifyOnNewRequest: true,
    notifyOnStatusChange: true,
    notifyOnCompletion: true,
    notifyOnUrgent: true,
  },
  firebaseConfig: {
    apiKey: '',
    projectId: 'pr-system-2026',
    isConnected: false
  }
};

export const CATEGORY_INFO: Record<ServiceCategory, { label: string; icon: string; color: string; desc: string }> = {
  poster: {
    label: 'ออกแบบโปสเตอร์ / สื่อกราฟิก',
    icon: 'Palette',
    color: '#007AFF', // iOS Blue
    desc: 'โปสเตอร์, แบนเนอร์, Infographic, สื่อโซเชียล, Backdrop'
  },
  photography: {
    label: 'ถ่ายภาพนิ่ง / วิดีโออีเวนต์',
    icon: 'Camera',
    color: '#FF9500', // iOS Orange
    desc: 'ถ่ายภาพกิจกรรม, บันทึกวิดีโอ, สัมภาษณ์, Drone'
  },
  facebook_pr: {
    label: 'ข่าวประชาสัมพันธ์ FB & เว็บ',
    icon: 'Share2',
    color: '#5856D6', // iOS Indigo
    desc: 'เขียนข่าว, โพสต์เฟซบุ๊ก, ข่าวสื่อมวลชน, Scoop ข่าว'
  },
  mc_event: {
    label: 'พิธีกร / แถลงข่าว / Live สด',
    icon: 'Mic',
    color: '#FF2D55', // iOS Pink
    desc: 'พิธีกรงานอีเวนต์, ถ่ายทอดสด Facebook/YouTube, ประสานสื่อ'
  },
  print_media: {
    label: 'สื่อสิ่งพิมพ์ / จดหมายข่าว',
    icon: 'BookOpen',
    color: '#34C759', // iOS Green
    desc: 'วารสาร, แผ่นพับ, ไวนิล, เกียรติบัตร, สิ่งพิมพ์'
  },
  other: {
    label: 'บริการประชาสัมพันธ์อื่นๆ',
    icon: 'Layers',
    color: '#8E8E93', // iOS Gray
    desc: 'ให้คำปรึกษาด้านสื่อ, การแถลงข่าว, บูธนิทรรศการ'
  }
};

export const STATUS_INFO: Record<JobStatus, { label: string; color: string; bgLight: string; bgDark: string; step: number }> = {
  pending: {
    label: 'รับเรื่อง / รอดำเนินการ',
    color: '#FF9500', // Amber
    bgLight: 'bg-amber-50 text-amber-700 border-amber-200',
    bgDark: 'dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60',
    step: 1
  },
  in_progress: {
    label: 'กำลังจัดทำ / ดำเนินการ',
    color: '#007AFF', // Blue
    bgLight: 'bg-blue-50 text-blue-700 border-blue-200',
    bgDark: 'dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800/60',
    step: 2
  },
  review: {
    label: 'รอตรวจทาน / แก้ไขแบบ',
    color: '#AF52DE', // Purple
    bgLight: 'bg-purple-50 text-purple-700 border-purple-200',
    bgDark: 'dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800/60',
    step: 3
  },
  delivered: {
    label: 'ส่งมอบ / เผยแพร่แล้ว',
    color: '#00C7BE', // Teal
    bgLight: 'bg-teal-50 text-teal-700 border-teal-200',
    bgDark: 'dark:bg-teal-950/40 dark:text-teal-300 dark:border-teal-800/60',
    step: 4
  },
  completed: {
    label: 'เสร็จสมบูรณ์',
    color: '#34C759', // Green
    bgLight: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    bgDark: 'dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60',
    step: 5
  }
};

export const PRIORITY_INFO: Record<PriorityLevel, { label: string; color: string; badge: string }> = {
  normal: {
    label: 'ปกติ',
    color: '#8E8E93',
    badge: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
  },
  urgent: {
    label: 'ด่วน (3-5 วัน)',
    color: '#FF9500',
    badge: 'bg-orange-100 text-orange-700 dark:bg-orange-950/60 dark:text-orange-300 border border-orange-200 dark:border-orange-800'
  },
  urgent_critical: {
    label: 'ด่วนที่สุด (1-2 วัน)',
    color: '#FF3B30',
    badge: 'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300 border border-red-200 dark:border-red-800 animate-pulse'
  }
};

export const DEPARTMENTS = [
  'คณะวิทยาศาสตร์และเทคโนโลยี',
  'กองวิเทศสัมพันธ์และเครือข่าย',
  'กองพัฒนานักศึกษาและกิจกรรม',
  'งานแนะแนวและทุนการศึกษา',
  'สถาบันวิจัยและพัฒนา',
  'สำนักงานเลขานุการและประชาสัมพันธ์กลาง',
  'คณะบริหารธุรกิจและการจัดการ',
  'คณะมนุษยศาสตร์และสังคมศาสตร์',
  'สำนักวิทยบริการและเทคโนโลยีสารสนเทศ',
  'ศูนย์ส่งเสริมศิลปวัฒนธรรม'
];

export const PR_OFFICERS = [
  'คุณพัชราภรณ์ (นักประชาสัมพันธ์ชำนาญการ - ออกแบบสื่อ)',
  'คุณเอกชัย (ช่างภาพประชาสัมพันธ์ - วิดีโอ/ภาพนิ่ง)',
  'คุณปิยดา (นักสื่อสารองค์กร - ข่าวสาร/โซเชียลมีเดีย)',
  'คุณณัฐวุฒิ (นักเทคโนโลยีสารสนเทศ - Live สด/ระบบ)',
  'คุณศุภลักษณ์ (หัวหน้าฝ่ายประชาสัมพันธ์)'
];
