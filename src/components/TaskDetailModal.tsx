import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  ExternalLink, 
  Copy, 
  Share2, 
  MessageSquare, 
  Send, 
  UserCheck, 
  Calendar, 
  Link2, 
  Building2, 
  Phone, 
  Flame, 
  Plus, 
  TrendingUp, 
  Check,
  Trash2
} from 'lucide-react';
import { PRJob, JobStatus, ActivityLog } from '../types';
import { CATEGORY_INFO, STATUS_INFO, PRIORITY_INFO, PR_OFFICERS } from '../data/seedData';
import { formatLineMessage, getLineAppShareUrl } from '../lib/lineNotify';

interface TaskDetailModalProps {
  job: PRJob | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateJob: (updated: PRJob) => void;
  onDeleteJob: (jobId: string) => void;
  onSendLineAlert: (job: PRJob, eventType: 'status_update' | 'completion' | 'urgent') => void;
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  job,
  isOpen,
  onClose,
  onUpdateJob,
  onDeleteJob,
  onSendLineAlert
}) => {
  if (!isOpen || !job) return null;

  const [assignedOfficer, setAssignedOfficer] = useState(job.assignedOfficer || '');
  const [progress, setProgress] = useState(job.progressPercentage);
  const [deliverableLink, setDeliverableLink] = useState(job.deliverableLink || '');
  const [reachImpressions, setReachImpressions] = useState(job.reachImpressions || 0);
  const [newLogNote, setNewLogNote] = useState('');
  const [copiedText, setCopiedText] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'details' | 'timeline' | 'line_alert'>('details');

  const categoryInfo = CATEGORY_INFO[job.category];
  const priorityConfig = PRIORITY_INFO[job.priority];
  const statusConfig = STATUS_INFO[job.status];

  const stages: JobStatus[] = ['pending', 'in_progress', 'review', 'delivered', 'completed'];

  const handleStatusChange = (newStatus: JobStatus) => {
    let newProgress = progress;
    if (newStatus === 'completed') newProgress = 100;
    else if (newStatus === 'delivered') newProgress = Math.max(90, progress);
    else if (newStatus === 'review') newProgress = Math.max(75, progress);
    else if (newStatus === 'in_progress') newProgress = Math.max(40, progress);

    const newLog: ActivityLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
      user: 'เจ้าหน้าที่ ปชส.',
      action: `ปรับสถานะเป็น "${STATUS_INFO[newStatus].label}"`,
      note: `ความคืบหน้า ${newProgress}%`
    };

    const updated: PRJob = {
      ...job,
      status: newStatus,
      progressPercentage: newProgress,
      completionDate: newStatus === 'completed' ? new Date().toISOString().slice(0, 10) : job.completionDate,
      logs: [newLog, ...job.logs]
    };

    onUpdateJob(updated);
    setProgress(newProgress);
    onSendLineAlert(updated, newStatus === 'completed' ? 'completion' : 'status_update');
  };

  const handleSaveDetails = () => {
    const newLog: ActivityLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
      user: 'เจ้าหน้าที่ ปชส.',
      action: 'อัปเดตข้อมูลรายละเอียดภารกิจ',
      note: newLogNote.trim() || undefined
    };

    const updated: PRJob = {
      ...job,
      assignedOfficer: assignedOfficer || undefined,
      progressPercentage: progress,
      deliverableLink: deliverableLink.trim() || undefined,
      reachImpressions: Number(reachImpressions) || 0,
      logs: newLogNote.trim() ? [newLog, ...job.logs] : job.logs
    };

    onUpdateJob(updated);
    setNewLogNote('');
    alert('บันทึกการเปลี่ยนแปลงสำเร็จ');
  };

  const lineMessageText = formatLineMessage(job, job.status === 'completed' ? 'completion' : 'status_update');
  const lineShareUrl = getLineAppShareUrl(lineMessageText);

  const handleCopyLineText = () => {
    navigator.clipboard.writeText(lineMessageText);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        id="task-detail-modal-sheet"
        className="w-full max-w-3xl bg-white dark:bg-neutral-900 rounded-[2rem] border border-neutral-200 dark:border-neutral-800 shadow-2xl overflow-hidden flex flex-col max-h-[94vh]"
      >
        {/* iOS Header */}
        <div className="relative pt-3 pb-3 px-6 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
          <div className="w-12 h-1.5 bg-neutral-300 dark:bg-neutral-700 rounded-full mx-auto absolute left-1/2 -translate-x-1/2 top-2" />
          <div className="pt-2">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-lg text-xs font-mono font-bold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                {job.jobCode}
              </span>
              <span className={`px-2 py-0.5 rounded-lg text-xs font-medium ${priorityConfig.badge}`}>
                {priorityConfig.label}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sub-tab Navigation (iOS Segmented) */}
        <div className="px-6 py-2 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50">
          <div className="inline-flex p-1 rounded-xl bg-neutral-200/60 dark:bg-neutral-800 text-xs font-medium w-full sm:w-auto">
            <button
              onClick={() => setActiveSubTab('details')}
              className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-lg transition-all ${
                activeSubTab === 'details'
                  ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-sm font-semibold'
                  : 'text-neutral-500 dark:text-neutral-400'
              }`}
            >
              ข้อมูลงาน & จัดการ
            </button>
            <button
              onClick={() => setActiveSubTab('line_alert')}
              className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-lg transition-all flex items-center justify-center space-x-1.5 ${
                activeSubTab === 'line_alert'
                  ? 'bg-white dark:bg-neutral-700 text-emerald-600 dark:text-emerald-400 shadow-sm font-semibold'
                  : 'text-neutral-500 dark:text-neutral-400'
              }`}
            >
              <span>LINE แจ้งเตือน</span>
            </button>
            <button
              onClick={() => setActiveSubTab('timeline')}
              className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-lg transition-all ${
                activeSubTab === 'timeline'
                  ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-sm font-semibold'
                  : 'text-neutral-500 dark:text-neutral-400'
              }`}
            >
              ประวัติ ({job.logs.length})
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* Main Title & Category */}
          <div>
            <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
              {categoryInfo.label}
            </span>
            <h2 className="text-base sm:text-xl font-bold text-neutral-900 dark:text-white mt-0.5 leading-snug">
              {job.title}
            </h2>
          </div>

          {/* Visual Interactive Stepper (iOS Style) */}
          <div className="p-4 rounded-3xl bg-neutral-100/70 dark:bg-neutral-800/50 border border-neutral-200/80 dark:border-neutral-700 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                สถานะขั้นตอนการดำเนินงาน (กดเพื่อเปลี่ยนสถานะ)
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${statusConfig.bgLight} ${statusConfig.bgDark}`}>
                {statusConfig.label}
              </span>
            </div>

            <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
              {stages.map((st, idx) => {
                const isCurrent = job.status === st;
                const isPast = STATUS_INFO[job.status].step > STATUS_INFO[st].step;
                const stInfo = STATUS_INFO[st];

                return (
                  <button
                    key={st}
                    onClick={() => handleStatusChange(st)}
                    className={`py-2 px-1 rounded-2xl border text-center transition-all flex flex-col items-center justify-center ${
                      isCurrent
                        ? 'border-blue-500 bg-blue-600 text-white shadow-md shadow-blue-500/20'
                        : isPast
                        ? 'border-emerald-500/40 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300'
                        : 'border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-500 hover:border-neutral-400'
                    }`}
                  >
                    <span className="text-[10px] font-bold opacity-80 mb-0.5">ขั้นที่ {idx + 1}</span>
                    <span className="text-[11px] font-semibold line-clamp-1 leading-tight px-1">
                      {stInfo.label.split('/')[0]}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Progress Slider */}
            <div className="pt-2">
              <div className="flex justify-between text-xs text-neutral-500 dark:text-neutral-400 mb-1">
                <span>ความคืบหน้าของงาน</span>
                <span className="font-bold text-neutral-800 dark:text-neutral-200">{progress}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={progress}
                onChange={(e) => setProgress(Number(e.target.value))}
                className="w-full h-2 bg-neutral-200 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>
          </div>

          {/* Sub-tab 1: Details & Management */}
          {activeSubTab === 'details' && (
            <div className="space-y-4">
              {/* Meta Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200/70 dark:border-neutral-700/60 text-xs">
                <div>
                  <span className="text-neutral-400">หน่วยงานผู้ขอ:</span>
                  <p className="font-semibold text-neutral-800 dark:text-neutral-200 mt-0.5">{job.department}</p>
                </div>
                <div>
                  <span className="text-neutral-400">ผู้ขอรับบริการ:</span>
                  <p className="font-semibold text-neutral-800 dark:text-neutral-200 mt-0.5">{job.requesterName} ({job.requesterContact})</p>
                </div>
                <div>
                  <span className="text-neutral-400">วันที่ยื่นเรื่อง:</span>
                  <p className="font-semibold text-neutral-800 dark:text-neutral-200 mt-0.5">{job.requestDate}</p>
                </div>
                <div>
                  <span className="text-neutral-400">กำหนดส่งมอบงาน:</span>
                  <p className="font-semibold text-red-600 dark:text-red-400 mt-0.5">{job.deadlineDate}</p>
                </div>
                {job.eventDate && (
                  <div>
                    <span className="text-neutral-400">วันที่จัดกิจกรรม:</span>
                    <p className="font-semibold text-neutral-800 dark:text-neutral-200 mt-0.5">{job.eventDate} ({job.location || 'ในสถานที่'})</p>
                  </div>
                )}
                {job.dimensionOrFormat && (
                  <div>
                    <span className="text-neutral-400">ขนาด / รูปแบบสื่อ:</span>
                    <p className="font-semibold text-neutral-800 dark:text-neutral-200 mt-0.5">{job.dimensionOrFormat}</p>
                  </div>
                )}
              </div>

              {/* Description */}
              {job.description && (
                <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200/70 dark:border-neutral-700/60">
                  <h4 className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-1">
                    รายละเอียดและความต้องการ:
                  </h4>
                  <p className="text-xs sm:text-sm text-neutral-800 dark:text-neutral-200 whitespace-pre-line leading-relaxed">
                    {job.description}
                  </p>
                </div>
              )}

              {/* Links */}
              {job.referenceLinks && (
                <div className="p-3 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/50 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2 text-blue-700 dark:text-blue-300">
                    <Link2 className="w-4 h-4 shrink-0" />
                    <span className="truncate">ลิงก์ข้อมูลแนบ / ข้อมูลอ้างอิง</span>
                  </div>
                  <a
                    href={job.referenceLinks}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 flex items-center space-x-1 shrink-0"
                  >
                    <span>เปิดลิงก์</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}

              {/* PR Operations Form: Assign Officer & Deliverable Link */}
              <div className="p-4 rounded-3xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 space-y-3">
                <h4 className="text-xs font-bold text-neutral-900 dark:text-white">
                  การจัดการฝ่ายประชาสัมพันธ์
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                      มอบหมายนักประชาสัมพันธ์ผู้รับผิดชอบ
                    </label>
                    <select
                      value={assignedOfficer}
                      onChange={(e) => setAssignedOfficer(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl text-xs bg-neutral-100 dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 border border-neutral-200 dark:border-neutral-600"
                    >
                      <option value="">-- ยังไม่ระบุ --</option>
                      {PR_OFFICERS.map((officer) => (
                        <option key={officer} value={officer}>{officer}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                      ยอดการเข้าถึง / Reach (Facebook & Social)
                    </label>
                    <input
                      type="number"
                      value={reachImpressions}
                      onChange={(e) => setReachImpressions(Number(e.target.value))}
                      placeholder="เช่น 15000"
                      className="w-full px-3 py-2 rounded-xl text-xs bg-neutral-100 dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 border border-neutral-200 dark:border-neutral-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                    ลิงก์ไฟล์ส่งมอบงาน (Google Drive / Canva / Cloud)
                  </label>
                  <input
                    type="url"
                    value={deliverableLink}
                    onChange={(e) => setDeliverableLink(e.target.value)}
                    placeholder="https://drive.google.com/..."
                    className="w-full px-3 py-2 rounded-xl text-xs bg-neutral-100 dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 border border-neutral-200 dark:border-neutral-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                    เพิ่มบันทึกความคืบหน้า / รายละเอียดแก้ไข
                  </label>
                  <input
                    type="text"
                    value={newLogNote}
                    onChange={(e) => setNewLogNote(e.target.value)}
                    placeholder="เช่น ส่งดราฟท์แรกให้ตรวจทานแล้ว, ลูกค้าขอเพิ่มโลโก้..."
                    className="w-full px-3 py-2 rounded-xl text-xs bg-neutral-100 dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 border border-neutral-200 dark:border-neutral-600"
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={handleSaveDetails}
                    className="px-5 py-2 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-semibold hover:opacity-90 transition-all shadow-sm"
                  >
                    บันทึกข้อมูลการทำงาน
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Sub-tab 2: LINE Notification Preview & Action */}
          {activeSubTab === 'line_alert' && (
            <div className="space-y-4">
              <div className="p-4 rounded-3xl bg-emerald-500/10 border border-emerald-500/20">
                <div className="flex items-center space-x-2 text-emerald-800 dark:text-emerald-300 font-bold text-sm mb-1">
                  <MessageSquare className="w-4 h-4" />
                  <span>ระบบแจ้งเตือนผ่าน LINE อัตโนมัติ</span>
                </div>
                <p className="text-xs text-emerald-700 dark:text-emerald-400">
                  ส่งข้อความสถานะงานเข้ากลุ่มไลน์งานประชาสัมพันธ์หรือส่งให้ผู้ขอรับบริการได้ทันที
                </p>
              </div>

              {/* iOS / LINE Message Card Preview */}
              <div className="p-4 rounded-3xl bg-neutral-900 text-neutral-100 border border-neutral-800 font-mono text-xs space-y-1 shadow-inner relative overflow-hidden">
                <div className="absolute top-3 right-3">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-sans font-semibold bg-emerald-500 text-white">
                    LINE Preview
                  </span>
                </div>
                <pre className="whitespace-pre-wrap font-sans text-xs leading-relaxed text-neutral-200 pt-2">
                  {lineMessageText}
                </pre>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <a
                  href={lineShareUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center space-x-2 py-3 px-4 rounded-2xl bg-[#06C755] hover:bg-[#05b34c] text-white font-semibold text-xs sm:text-sm shadow-md shadow-emerald-500/20 transition-all active:scale-95"
                >
                  <Share2 className="w-4 h-4" />
                  <span>เปิดแชร์ไปที่ LINE โดยตรง</span>
                </a>

                <button
                  onClick={handleCopyLineText}
                  className="flex items-center justify-center space-x-2 py-3 px-4 rounded-2xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 font-semibold text-xs sm:text-sm transition-all"
                >
                  {copiedText ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedText ? 'คัดลอกข้อความแล้ว!' : 'คัดลอกข้อความแจ้งเตือน'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Sub-tab 3: Activity Logs */}
          {activeSubTab === 'timeline' && (
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
                ประวัติการดำเนินการ (Audit Logs)
              </h4>
              <div className="space-y-2.5">
                {job.logs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/70 dark:border-neutral-700/60 text-xs"
                  >
                    <div className="flex items-center justify-between text-neutral-400 text-[11px] mb-1">
                      <span className="font-semibold text-blue-600 dark:text-blue-400">{log.user}</span>
                      <span>{log.timestamp}</span>
                    </div>
                    <p className="font-medium text-neutral-800 dark:text-neutral-200">{log.action}</p>
                    {log.note && (
                      <p className="text-neutral-500 dark:text-neutral-400 mt-1 bg-white/70 dark:bg-neutral-800/80 p-2 rounded-xl border border-neutral-200/50 dark:border-neutral-700/50">
                        {log.note}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
          <button
            onClick={() => {
              if (confirm(`ยืนยันการลบภารกิจ ${job.jobCode} หรือไม่?`)) {
                onDeleteJob(job.id);
                onClose();
              }
            }}
            className="flex items-center space-x-1 text-xs text-red-500 hover:text-red-700 font-medium"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>ลบรายการนี้</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-xs font-medium hover:bg-neutral-200 dark:hover:bg-neutral-700"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
};
