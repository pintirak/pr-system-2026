import { PRJob, LineNotificationConfig } from '../types';
import { STATUS_INFO, CATEGORY_INFO, PRIORITY_INFO } from '../data/seedData';

export interface LineAlertMessage {
  type: 'new_request' | 'status_update' | 'completion' | 'urgent';
  title: string;
  body: string;
  shareUrl: string;
  timestamp: string;
}

/**
 * Format message for LINE text dispatch or direct LINE app sharing
 */
export function formatLineMessage(job: PRJob, eventType: 'new_request' | 'status_update' | 'completion' | 'urgent'): string {
  const cat = CATEGORY_INFO[job.category]?.label || job.category;
  const status = STATUS_INFO[job.status]?.label || job.status;
  const priority = PRIORITY_INFO[job.priority]?.label || job.priority;

  let headerEmoji = '📢';
  let eventName = 'แจ้งเตือนระบบ PR SYSTEM';

  if (eventType === 'new_request') {
    headerEmoji = '🆕';
    eventName = 'มีคำขอรับบริการงานประชาสัมพันธ์ใหม่!';
  } else if (eventType === 'status_update') {
    headerEmoji = '🔄';
    eventName = `อัปเดตสถานะงาน: [${status}]`;
  } else if (eventType === 'completion') {
    headerEmoji = '✅';
    eventName = 'งานประชาสัมพันธ์เสร็จสมบูรณ์เรียบร้อย!';
  } else if (eventType === 'urgent') {
    headerEmoji = '🚨';
    eventName = 'งานด่วน/ด่วนที่สุด ต้องการความช่วยเหลือ!';
  }

  const lines = [
    `${headerEmoji} 【PR SERVICE NOTIFICATION】`,
    `📌 ${eventName}`,
    `--------------------------------`,
    `🔖 รหัสงาน: ${job.jobCode}`,
    `📋 ชื่องาน: ${job.title}`,
    `📂 ประเภท: ${cat}`,
    `🏢 หน่วยงาน: ${job.department}`,
    `👤 ผู้ขอรับบริการ: ${job.requesterName}`,
    `📞 ติดต่อ: ${job.requesterContact}`,
    `⏱️ กำหนดส่งมอบ: ${job.deadlineDate}`,
    `⚡ ระดับความด่วน: ${priority}`,
    `📊 สถานะปัจจุบัน: ${status} (${job.progressPercentage}%)`,
  ];

  if (job.assignedOfficer) {
    lines.push(`👨‍💼 ผู้รับผิดชอบ (ฝ่าย ปชส.): ${job.assignedOfficer}`);
  }

  if (job.deliverableLink) {
    lines.push(`🔗 ลิงก์ไฟล์งาน/ผลงาน: ${job.deliverableLink}`);
  }

  lines.push(`--------------------------------`);
  lines.push(`📅 ระบบ PR SYSTEM ประชาสัมพันธ์องค์กร`);

  return lines.join('\n');
}

/**
 * Generate LINE direct share link to send message to any LINE chat/group with 1-click
 */
export function getLineAppShareUrl(text: string): string {
  return `https://line.me/R/msg/text/?${encodeURIComponent(text)}`;
}

/**
 * Send notification to external Webhook or LINE Notify if configured
 */
export async function sendWebhookNotification(
  config: LineNotificationConfig,
  job: PRJob,
  eventType: 'new_request' | 'status_update' | 'completion' | 'urgent'
): Promise<{ success: boolean; message: string }> {
  const formattedText = formatLineMessage(job, eventType);

  // If user has a webhook URL configured (e.g. proxy server, LINE bot, n8n, Make)
  if (config.webhookUrl && config.webhookUrl.trim() !== '') {
    try {
      const response = await fetch(config.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType,
          jobCode: job.jobCode,
          title: job.title,
          category: job.category,
          status: job.status,
          message: formattedText,
          jobData: job,
          timestamp: new Date().toISOString()
        })
      });

      if (response.ok) {
        return { success: true, message: 'ส่งการแจ้งเตือนไปยัง Webhook สำเร็จ' };
      } else {
        return { success: false, message: `Webhook ตอบกลับข้อผิดพลาด HTTP ${response.status}` };
      }
    } catch (err) {
      console.warn('Webhook dispatch failed:', err);
      return { success: false, message: 'ไม่สามารถติดต่อ Webhook ได้ (อาจติด CORS หรือ URL ปลายทาง)' };
    }
  }

  // Simulated instant delivery confirmation with 1-click LINE app share
  return {
    success: true,
    message: 'ระบบสร้างข้อความแจ้งเตือน LINE แล้ว พร้อมกดแชร์เข้ากลุ่ม LINE ได้ทันที'
  };
}
