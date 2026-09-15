import { PRJob, MonthlyPRSummary, ServiceCategory, JobStatus } from '../types';
import { CATEGORY_INFO, STATUS_INFO } from '../data/seedData';

export function getAvailableMonths(jobs: PRJob[]): string[] {
  const months = new Set<string>();
  jobs.forEach(j => {
    if (j.requestDate && j.requestDate.length >= 7) {
      months.add(j.requestDate.substring(0, 7));
    }
  });
  // Ensure current month is included
  const currentMonth = new Date().toISOString().substring(0, 7);
  months.add(currentMonth);
  return Array.from(months).sort().reverse();
}

export function formatThaiMonth(yearMonth: string): string {
  // yearMonth is like "2026-09"
  const [yearStr, monthStr] = yearMonth.split('-');
  const monthNum = parseInt(monthStr, 10);
  const thaiYear = parseInt(yearStr, 10) + 543;

  const thaiMonths = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
  ];

  const monthName = thaiMonths[monthNum - 1] || monthStr;
  return `${monthName} ${thaiYear}`;
}

export function calculateMonthlySummary(jobs: PRJob[], yearMonth: string): MonthlyPRSummary {
  const monthlyJobs = jobs.filter(j => j.requestDate.startsWith(yearMonth));

  const totalJobs = monthlyJobs.length;
  const completedJobs = monthlyJobs.filter(j => j.status === 'completed' || j.status === 'delivered').length;
  const inProgressJobs = monthlyJobs.filter(j => j.status === 'in_progress' || j.status === 'review').length;
  const urgentJobs = monthlyJobs.filter(j => j.priority === 'urgent' || j.priority === 'urgent_critical').length;

  const completionRate = totalJobs > 0 ? Math.round((completedJobs / totalJobs) * 100) : 0;

  // Turnaround days calculation
  let totalDays = 0;
  let closedCount = 0;
  monthlyJobs.forEach(j => {
    if (j.status === 'completed' && j.completionDate && j.requestDate) {
      const start = new Date(j.requestDate).getTime();
      const end = new Date(j.completionDate).getTime();
      const diffDays = Math.max(1, Math.round((end - start) / (1000 * 60 * 60 * 24)));
      totalDays += diffDays;
      closedCount++;
    }
  });
  const avgTurnaroundDays = closedCount > 0 ? Math.round((totalDays / closedCount) * 10) / 10 : 3.5;

  // Total reach
  const totalReach = monthlyJobs.reduce((acc, j) => acc + (j.reachImpressions || 0), 0);

  // Category breakdown
  const categoryBreakdown: Record<ServiceCategory, number> = {
    poster: 0,
    photography: 0,
    facebook_pr: 0,
    mc_event: 0,
    print_media: 0,
    other: 0
  };
  monthlyJobs.forEach(j => {
    categoryBreakdown[j.category] = (categoryBreakdown[j.category] || 0) + 1;
  });

  // Status breakdown
  const statusBreakdown: Record<JobStatus, number> = {
    pending: 0,
    in_progress: 0,
    review: 0,
    delivered: 0,
    completed: 0
  };
  monthlyJobs.forEach(j => {
    statusBreakdown[j.status] = (statusBreakdown[j.status] || 0) + 1;
  });

  // Top departments
  const deptCounts: Record<string, number> = {};
  monthlyJobs.forEach(j => {
    deptCounts[j.department] = (deptCounts[j.department] || 0) + 1;
  });
  const topDepartments = Object.entries(deptCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const thaiMonthName = formatThaiMonth(yearMonth);

  // Auto PR Executive Summary narrative
  const topCatEntry = Object.entries(categoryBreakdown).sort((a, b) => b[1] - a[1])[0];
  const topCatName = topCatEntry && topCatEntry[1] > 0 ? CATEGORY_INFO[topCatEntry[0] as ServiceCategory]?.label : 'สื่อสิ่งพิมพ์และออกแบบ';

  const executiveSummary = `รายงานสรุปผลการดำเนินงานประชาสัมพันธ์ ประจำเดือน${thaiMonthName}

ในรอบเดือน${thaiMonthName} ฝ่ายประชาสัมพันธ์และสื่อสารองค์กรได้รับคำขอรับบริการทั้งสิ้น ${totalJobs} ภารกิจ โดยดำเนินการส่งมอบและแล้วเสร็จจำนวน ${completedJobs} ภารกิจ คิดเป็นอัตราความสำเร็จ ${completionRate}% และมีงานที่อยู่ระหว่างดำเนินการ ${inProgressJobs} ภารกิจ

ภารกิจบริการที่มีการขอรับบริการสูงสุด ได้แก่ "${topCatName}" จำนวน ${topCatEntry ? topCatEntry[1] : 0} ภารกิจ โดยมีระยะเวลาดำเนินการเฉลี่ยประมาณ ${avgTurnaroundDays} วันทำการต่อภารกิจ 

ในด้านการเผยแพร่ข่าวสารผ่าน Social Media และช่องทางออนไลน์ สามารถสร้างยอดการเข้าถึง (Estimated Reach & Impressions) สะสมรวมได้มากกว่า ${totalReach.toLocaleString()} ครั้ง สะท้อนถึงการกระจายข้อมูลข่าวสารขององค์กรอย่างมีประสิทธิภาพและตรงกลุ่มเป้าหมาย`;

  return {
    yearMonth,
    totalJobs,
    completedJobs,
    inProgressJobs,
    urgentJobs,
    completionRate,
    avgTurnaroundDays,
    totalReach,
    categoryBreakdown,
    statusBreakdown,
    topDepartments,
    highlightJobs: monthlyJobs.slice(0, 4),
    aiExecutiveSummary: executiveSummary
  };
}

/**
 * Generate CSV text for download
 */
export function generateMonthlyCSV(jobs: PRJob[], yearMonth: string): string {
  const monthlyJobs = jobs.filter(j => j.requestDate.startsWith(yearMonth));
  const headers = ['รหัสงาน', 'ชื่องาน', 'ประเภทบริการ', 'หน่วยงานผู้ขอ', 'ผู้ขอรับบริการ', 'เบอร์ติดต่อ', 'วันที่ยื่นขอ', 'กำหนดส่งมอบ', 'ความด่วน', 'สถานะ', 'ผู้รับผิดชอบ (ฝ่าย ปชส.)', 'ยอด Reach'];
  
  const rows = monthlyJobs.map(j => [
    `"${j.jobCode}"`,
    `"${j.title.replace(/"/g, '""')}"`,
    `"${CATEGORY_INFO[j.category]?.label || j.category}"`,
    `"${j.department}"`,
    `"${j.requesterName}"`,
    `"${j.requesterContact}"`,
    `"${j.requestDate}"`,
    `"${j.deadlineDate}"`,
    `"${j.priority}"`,
    `"${STATUS_INFO[j.status]?.label || j.status}"`,
    `"${j.assignedOfficer || '-'}"`,
    `"${j.reachImpressions || 0}"`
  ]);

  return '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
}
