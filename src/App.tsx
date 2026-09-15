import { useState, useEffect } from 'react';
import { PRJob, SystemConfig, JobStatus, ActivityLog } from './types';
import { getStoredJobs, saveStoredJobs, getStoredConfig, saveStoredConfig } from './lib/storage';
import { formatLineMessage, sendWebhookNotification } from './lib/lineNotify';
import { STATUS_INFO } from './data/seedData';
import { Header } from './components/Header';
import { Navigation, ActiveTab } from './components/Navigation';
import { DashboardView } from './components/DashboardView';
import { RequestListView } from './components/RequestListView';
import { NewRequestModal } from './components/NewRequestModal';
import { TaskDetailModal } from './components/TaskDetailModal';
import { MonthlyReportView } from './components/MonthlyReportView';
import { SettingsView } from './components/SettingsView';
import { CheckCircle2, MessageSquare, X } from 'lucide-react';

export default function App() {
  const [jobs, setJobs] = useState<PRJob[]>(() => getStoredJobs());
  const [config, setConfig] = useState<SystemConfig>(() => getStoredConfig());
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  
  // Modals
  const [isNewRequestOpen, setIsNewRequestOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<PRJob | null>(null);

  // Toast alert
  const [toastMessage, setToastMessage] = useState<{ title: string; desc?: string; type: 'success' | 'line' } | null>(null);

  // Sync theme with document element
  useEffect(() => {
    if (config.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [config.theme]);

  // Persist jobs changes
  const updateJobs = (newJobs: PRJob[]) => {
    setJobs(newJobs);
    saveStoredJobs(newJobs);
  };

  // Toggle dark/light mode
  const handleToggleTheme = () => {
    const nextTheme = config.theme === 'dark' ? 'light' : 'dark';
    const updated = { ...config, theme: nextTheme };
    setConfig(updated);
    saveStoredConfig(updated);
  };

  // Toast trigger
  const showToast = (title: string, desc?: string, type: 'success' | 'line' = 'success') => {
    setToastMessage({ title, desc, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Advance Job Status (1-click from dashboard)
  const handleAdvanceStatus = (job: PRJob, nextStatus: JobStatus) => {
    let newProgress = job.progressPercentage;
    if (nextStatus === 'completed') newProgress = 100;
    else if (nextStatus === 'delivered') newProgress = Math.max(90, job.progressPercentage);
    else if (nextStatus === 'review') newProgress = Math.max(75, job.progressPercentage);
    else if (nextStatus === 'in_progress') newProgress = Math.max(40, job.progressPercentage);

    const newLog: ActivityLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
      user: 'เจ้าหน้าที่ ปชส.',
      action: `ปรับสถานะเป็น "${STATUS_INFO[nextStatus].label}"`,
      note: `ความคืบหน้า ${newProgress}%`
    };

    const updatedJob: PRJob = {
      ...job,
      status: nextStatus,
      progressPercentage: newProgress,
      completionDate: nextStatus === 'completed' ? new Date().toISOString().slice(0, 10) : job.completionDate,
      logs: [newLog, ...job.logs]
    };

    const updatedList = jobs.map(j => j.id === job.id ? updatedJob : j);
    updateJobs(updatedList);

    // Send LINE Alert if enabled
    if (config.lineConfig.enabled && config.lineConfig.notifyOnStatusChange) {
      sendWebhookNotification(config.lineConfig, updatedJob, nextStatus === 'completed' ? 'completion' : 'status_update');
      showToast(
        `อัปเดตสถานะ "${updatedJob.jobCode}" สำเร็จ`,
        `ปรับเป็น ${STATUS_INFO[nextStatus].label} พร้อมแจ้งเตือน LINE`,
        'line'
      );
    } else {
      showToast(`อัปเดตสถานะ "${updatedJob.jobCode}" เป็น ${STATUS_INFO[nextStatus].label}`);
    }
  };

  // Add new PR Request
  const handleCreateJob = (newJobData: Omit<PRJob, 'id' | 'jobCode' | 'status' | 'progressPercentage' | 'logs'> & { notifyLine: boolean }) => {
    const currentYearMonth = new Date().toISOString().slice(0, 7).replace('-', '');
    const jobSeq = (jobs.length + 1).toString().padStart(4, '0');
    const jobCode = `PR-${currentYearMonth.slice(0, 4)}-${jobSeq.slice(-4)}`;

    const newJob: PRJob = {
      id: `pr-job-${Date.now()}`,
      jobCode,
      title: newJobData.title,
      category: newJobData.category,
      department: newJobData.department,
      requesterName: newJobData.requesterName,
      requesterContact: newJobData.requesterContact,
      requestDate: newJobData.requestDate,
      deadlineDate: newJobData.deadlineDate,
      eventDate: newJobData.eventDate,
      location: newJobData.location,
      priority: newJobData.priority,
      status: 'pending',
      description: newJobData.description,
      dimensionOrFormat: newJobData.dimensionOrFormat,
      targetAudience: newJobData.targetAudience,
      referenceLinks: newJobData.referenceLinks,
      progressPercentage: 10,
      logs: [
        {
          id: `log-${Date.now()}`,
          timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
          user: newJobData.requesterName,
          action: 'ยื่นคำขอรับบริการงานประชาสัมพันธ์ผ่านระบบ PR SYSTEM',
          note: newJobData.description ? newJobData.description.slice(0, 80) : undefined
        }
      ]
    };

    const updatedList = [newJob, ...jobs];
    updateJobs(updatedList);

    // LINE Notification
    if (newJobData.notifyLine && config.lineConfig.enabled) {
      sendWebhookNotification(config.lineConfig, newJob, 'new_request');
      showToast(
        `บันทึกคำขอรับบริการ ${jobCode} สำเร็จ`,
        'ระบบแจ้งเตือนเข้ากลุ่ม LINE งานประชาสัมพันธ์เรียบร้อยแล้ว',
        'line'
      );
    } else {
      showToast(`บันทึกคำขอรับบริการ ${jobCode} สำเร็จ`);
    }

    setActiveTab('dashboard');
  };

  // Update existing job
  const handleUpdateJob = (updated: PRJob) => {
    const updatedList = jobs.map(j => j.id === updated.id ? updated : j);
    updateJobs(updatedList);
    setSelectedJob(updated);
  };

  // Delete job
  const handleDeleteJob = (jobId: string) => {
    const updatedList = jobs.filter(j => j.id !== jobId);
    updateJobs(updatedList);
    showToast('ลบรายการภารกิจเรียบร้อยแล้ว');
  };

  // Counts for Header & Nav
  const pendingCount = jobs.filter(j => j.status === 'pending').length;
  const activeCount = jobs.filter(j => j.status !== 'completed').length;
  const urgentCount = jobs.filter(j => (j.priority === 'urgent' || j.priority === 'urgent_critical') && j.status !== 'completed').length;

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      config.theme === 'dark' ? 'bg-[#000000] text-neutral-100' : 'bg-[#F2F2F7] text-neutral-900'
    }`}>
      {/* Toast Notification Banner (iOS style) */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 animate-in slide-in-from-top-4 duration-300 max-w-sm w-full">
          <div className="p-3.5 rounded-2xl bg-white/95 dark:bg-neutral-800/95 backdrop-blur-xl border border-neutral-200 dark:border-neutral-700 shadow-xl flex items-start space-x-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
              toastMessage.type === 'line' ? 'bg-[#06C755] text-white' : 'bg-blue-600 text-white'
            }`}>
              {toastMessage.type === 'line' ? <MessageSquare className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
            </div>
            <div className="flex-1 min-w-0">
              <h5 className="font-semibold text-xs sm:text-sm text-neutral-900 dark:text-white">
                {toastMessage.title}
              </h5>
              {toastMessage.desc && (
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 line-clamp-2">
                  {toastMessage.desc}
                </p>
              )}
            </div>
            <button
              onClick={() => setToastMessage(null)}
              className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* iOS App Header */}
      <Header
        config={config}
        onToggleTheme={handleToggleTheme}
        onOpenNewRequest={() => setIsNewRequestOpen(true)}
        activeCount={activeCount}
        urgentCount={urgentCount}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 sm:pt-4">
        {/* Navigation Tabs (Desktop Segmented & Mobile Dock) */}
        <Navigation
          activeTab={activeTab}
          onChangeTab={(tab) => {
            if (tab === 'new_request') {
              setIsNewRequestOpen(true);
            } else {
              setActiveTab(tab);
            }
          }}
          pendingCount={pendingCount}
        />

        {/* View Routing */}
        <div className="mt-2 sm:mt-4">
          {activeTab === 'dashboard' && (
            <DashboardView
              jobs={jobs}
              onSelectJob={(job) => setSelectedJob(job)}
              onAdvanceStatus={handleAdvanceStatus}
              onOpenNewRequest={() => setIsNewRequestOpen(true)}
            />
          )}

          {activeTab === 'list' && (
            <RequestListView
              jobs={jobs}
              onSelectJob={(job) => setSelectedJob(job)}
              onOpenNewRequest={() => setIsNewRequestOpen(true)}
            />
          )}

          {activeTab === 'monthly_report' && (
            <MonthlyReportView
              jobs={jobs}
              onSelectJob={(job) => setSelectedJob(job)}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsView
              config={config}
              jobs={jobs}
              onUpdateConfig={(updated) => {
                setConfig(updated);
                saveStoredConfig(updated);
              }}
              onRefreshJobs={(newJobs) => {
                setJobs(newJobs);
                saveStoredJobs(newJobs);
              }}
            />
          )}
        </div>
      </main>

      {/* New Request Modal Sheet */}
      <NewRequestModal
        isOpen={isNewRequestOpen}
        onClose={() => setIsNewRequestOpen(false)}
        onSubmit={handleCreateJob}
        existingCount={jobs.length}
      />

      {/* Task Detail Modal */}
      <TaskDetailModal
        job={selectedJob}
        isOpen={Boolean(selectedJob)}
        onClose={() => setSelectedJob(null)}
        onUpdateJob={handleUpdateJob}
        onDeleteJob={handleDeleteJob}
        onSendLineAlert={(job, type) => {
          if (config.lineConfig.enabled) {
            sendWebhookNotification(config.lineConfig, job, type);
          }
        }}
      />
    </div>
  );
}
