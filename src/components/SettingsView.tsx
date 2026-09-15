import React, { useState, useRef } from 'react';
import { 
  Database, 
  Download, 
  Upload, 
  RotateCcw, 
  Github, 
  MessageSquare, 
  Flame, 
  Check, 
  ExternalLink, 
  Copy, 
  ShieldCheck, 
  Layers, 
  Server,
  Bell,
  Code
} from 'lucide-react';
import { SystemConfig, PRJob } from '../types';
import { exportDatabaseToFile, importDatabaseFromFile, resetDatabaseToSeed } from '../lib/storage';
import { initializeFirebaseWithConfig, syncJobsToFirestore, isFirebaseReady } from '../lib/firebase';
import { sendWebhookNotification } from '../lib/lineNotify';

interface SettingsViewProps {
  config: SystemConfig;
  jobs: PRJob[];
  onUpdateConfig: (updated: SystemConfig) => void;
  onRefreshJobs: (newJobs: PRJob[]) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  config,
  jobs,
  onUpdateConfig,
  onRefreshJobs
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'storage' | 'github' | 'line' | 'firebase'>('storage');
  
  // LINE settings
  const [targetChannelName, setTargetChannelName] = useState(config.lineConfig.targetChannelName);
  const [webhookUrl, setWebhookUrl] = useState(config.lineConfig.webhookUrl || '');
  const [notifyOnNewRequest, setNotifyOnNewRequest] = useState(config.lineConfig.notifyOnNewRequest);
  const [notifyOnStatusChange, setNotifyOnStatusChange] = useState(config.lineConfig.notifyOnStatusChange);
  const [notifyOnCompletion, setNotifyOnCompletion] = useState(config.lineConfig.notifyOnCompletion);
  const [notifyOnUrgent, setNotifyOnUrgent] = useState(config.lineConfig.notifyOnUrgent);
  const [lineTestStatus, setLineTestStatus] = useState<string | null>(null);

  // Firebase settings
  const [firebaseApiKey, setFirebaseApiKey] = useState(config.firebaseConfig?.apiKey || '');
  const [firebaseProjectId, setFirebaseProjectId] = useState(config.firebaseConfig?.projectId || 'pr-system-2026');
  const [firebaseStatus, setFirebaseStatus] = useState<string | null>(null);

  const [copiedGitCmd, setCopiedGitCmd] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSaveLineSettings = () => {
    const updated: SystemConfig = {
      ...config,
      lineConfig: {
        ...config.lineConfig,
        targetChannelName,
        webhookUrl: webhookUrl.trim(),
        notifyOnNewRequest,
        notifyOnStatusChange,
        notifyOnCompletion,
        notifyOnUrgent
      }
    };
    onUpdateConfig(updated);
    alert('บันทึกการตั้งค่า LINE เรียบร้อย');
  };

  const handleTestLineAlert = async () => {
    if (jobs.length === 0) return;
    setLineTestStatus('กำลังทดสอบส่งการแจ้งเตือน...');
    const result = await sendWebhookNotification(
      {
        ...config.lineConfig,
        webhookUrl: webhookUrl.trim(),
        targetChannelName
      },
      jobs[0],
      'new_request'
    );
    setLineTestStatus(result.message);
  };

  const handleFileImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const result = await importDatabaseFromFile(file);
    if (result.success) {
      alert(result.message);
      // reload from storage
      window.location.reload();
    } else {
      alert(result.message);
    }
  };

  const handleResetSeed = () => {
    if (confirm('คุณต้องการรีเซ็ตฐานข้อมูลกลับเป็นข้อมูลตัวอย่างเริ่มต้นใช่หรือไม่?')) {
      const resetJobs = resetDatabaseToSeed();
      onRefreshJobs(resetJobs);
      alert('รีเซ็ตฐานข้อมูลสำเร็จ');
    }
  };

  const handleConnectFirebase = () => {
    const res = initializeFirebaseWithConfig({
      apiKey: firebaseApiKey,
      projectId: firebaseProjectId
    });
    setFirebaseStatus(res.message);
    if (res.success) {
      const updated: SystemConfig = {
        ...config,
        firebaseConfig: {
          apiKey: firebaseApiKey,
          projectId: firebaseProjectId,
          isConnected: true
        }
      };
      onUpdateConfig(updated);
    }
  };

  const handleSyncToFirebase = async () => {
    setFirebaseStatus('กำลังซิงค์ข้อมูลขึ้น Firebase Firestore...');
    const res = await syncJobsToFirestore(jobs);
    setFirebaseStatus(res.message);
  };

  const gitCommands = `# คำสั่งสำหรับการนำโปรเจกต์ PR System ขึ้น GitHub
git init
git add .
git commit -m "feat: PR System with iOS design and LINE notification"
git branch -M main
git remote add origin https://github.com/<your-github-username>/pr-system.git
git push -u origin main`;

  const handleCopyGitCommands = () => {
    navigator.clipboard.writeText(gitCommands);
    setCopiedGitCmd(true);
    setTimeout(() => setCopiedGitCmd(false), 2000);
  };

  return (
    <div id="settings-view" className="space-y-6 pb-12">
      {/* Sub-tabs iOS segmented control */}
      <div className="p-4 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-sm">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveSubTab('storage')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-2xl text-xs sm:text-sm font-semibold transition-all ${
              activeSubTab === 'storage'
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>ระบบไฟล์เบส (File-Base)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('github')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-2xl text-xs sm:text-sm font-semibold transition-all ${
              activeSubTab === 'github'
                ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 shadow-sm'
                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200'
            }`}
          >
            <Github className="w-4 h-4" />
            <span>เตรียมขึ้น GitHub</span>
          </button>

          <button
            onClick={() => setActiveSubTab('line')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-2xl text-xs sm:text-sm font-semibold transition-all ${
              activeSubTab === 'line'
                ? 'bg-[#06C755] text-white shadow-sm shadow-emerald-500/20'
                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>แจ้งเตือน LINE</span>
          </button>

          <button
            onClick={() => setActiveSubTab('firebase')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-2xl text-xs sm:text-sm font-semibold transition-all ${
              activeSubTab === 'firebase'
                ? 'bg-amber-600 text-white shadow-sm shadow-amber-500/20'
                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200'
            }`}
          >
            <Flame className="w-4 h-4" />
            <span>Firebase / Cloud</span>
          </button>
        </div>
      </div>

      {/* 1. File-base Storage Management */}
      {activeSubTab === 'storage' && (
        <div className="space-y-4">
          <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-sm space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                  ระบบฐานข้อมูลแบบไฟล์เบส (File-Base Local Persistence)
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  ระบบทำงานแบบ File-based บันทึกข้อมูลอัตโนมัติลงในเครื่อง พร้อมฟังก์ชันสำรองและกู้คืนไฟล์ .json
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/70 dark:border-neutral-700/60 flex items-center justify-between">
              <div>
                <span className="text-xs text-neutral-500 dark:text-neutral-400">สถานะฐานข้อมูลปัจจุบัน:</span>
                <p className="font-semibold text-sm text-neutral-900 dark:text-white">
                  มีรายการภารกิจทั้งหมด {jobs.length} รายการ
                </p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                พร้อมใช้งาน (Persistent)
              </span>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              {/* Export JSON */}
              <button
                onClick={exportDatabaseToFile}
                className="flex items-center justify-center space-x-2 p-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm shadow-md shadow-blue-500/20 transition-all active:scale-95"
              >
                <Download className="w-4 h-4" />
                <span>ดาวน์โหลดไฟล์ .json</span>
              </button>

              {/* Import JSON */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center justify-center space-x-2 p-3.5 rounded-2xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 font-semibold text-xs sm:text-sm transition-all"
              >
                <Upload className="w-4 h-4" />
                <span>นำเข้าไฟล์ .json สำรอง</span>
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileImport}
                accept=".json"
                className="hidden"
              />

              {/* Reset to Demo */}
              <button
                onClick={handleResetSeed}
                className="flex items-center justify-center space-x-2 p-3.5 rounded-2xl border border-neutral-200 dark:border-neutral-700 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30 text-neutral-600 dark:text-neutral-400 font-semibold text-xs sm:text-sm transition-all"
              >
                <RotateCcw className="w-4 h-4" />
                <span>รีเซ็ตเป็นข้อมูลตัวอย่าง</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. GitHub Setup */}
      {activeSubTab === 'github' && (
        <div className="space-y-4">
          <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-sm space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 flex items-center justify-center">
                <Github className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                  การจัดเตรียมไฟล์และโครงสร้างสำหรับขึ้น GitHub
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  โปรเจกต์นี้ได้รับการจัดโครงสร้างตามมาตรฐาน Git พร้อมไฟล์ README.md, .gitignore และ package.json ครบถ้วน
                </p>
              </div>
            </div>

            {/* Checklist */}
            <div className="space-y-2 p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/70 dark:border-neutral-700/60 text-xs">
              <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400">
                <Check className="w-4 h-4" />
                <span>ไฟล์ <code>package.json</code> และ <code>tsconfig.json</code> พร้อมสคริปต์ build / dev</span>
              </div>
              <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400">
                <Check className="w-4 h-4" />
                <span>ไฟล์ <code>.gitignore</code> กรอง <code>node_modules</code> และ <code>dist</code></span>
              </div>
              <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400">
                <Check className="w-4 h-4" />
                <span>ไฟล์ <code>README.md</code> คู่มือการติดตั้งและคำอธิบายระบบ PR SYSTEM</span>
              </div>
              <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400">
                <Check className="w-4 h-4" />
                <span>รองรับการ Export ไปยัง GitHub ได้ทันทีจากเมนู Settings ของ AI Studio</span>
              </div>
            </div>

            {/* Terminal Commands */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  คำสั่ง Terminal สำหรับ Push ขึ้น Repository ของคุณ:
                </span>
                <button
                  onClick={handleCopyGitCommands}
                  className="flex items-center space-x-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {copiedGitCmd ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedGitCmd ? 'คัดลอกคำสั่งแล้ว!' : 'คัดลอกคำสั่ง Git'}</span>
                </button>
              </div>
              <pre className="p-4 rounded-2xl bg-neutral-950 text-neutral-200 font-mono text-xs overflow-x-auto">
                {gitCommands}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* 3. LINE Notification */}
      {activeSubTab === 'line' && (
        <div className="space-y-4">
          <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-sm space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-[#06C755] text-white flex items-center justify-center font-bold text-sm">
                LINE
              </div>
              <div>
                <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                  ตั้งค่าระบบแจ้งเตือนผ่าน LINE
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  รองรับทั้ง 1-Click Direct Share และการส่งข้อความผ่าน Webhook ไปยัง LINE Notify / LINE Bot
                </p>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  ชื่อกลุ่ม LINE / ช่องทางการแจ้งเตือน
                </label>
                <input
                  type="text"
                  value={targetChannelName}
                  onChange={(e) => setTargetChannelName(e.target.value)}
                  placeholder="เช่น กลุ่มงานประชาสัมพันธ์และสื่อสารองค์กร"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs sm:text-sm text-neutral-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Webhook URL (ตัวเลือกเสริม: สำหรับส่งอัตโนมัติผ่าน Make / Zapier / n8n / Serverless)
                </label>
                <input
                  type="url"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  placeholder="https://hook.make.com/... หรือ https://discord.com/api/webhooks/..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs sm:text-sm text-neutral-900 dark:text-white"
                />
              </div>

              {/* Notification Triggers */}
              <div className="pt-2 space-y-2">
                <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  เงื่อนไขการแจ้งเตือน:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <label className="flex items-center space-x-2 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifyOnNewRequest}
                      onChange={(e) => setNotifyOnNewRequest(e.target.checked)}
                      className="rounded text-emerald-500 focus:ring-emerald-500"
                    />
                    <span>แจ้งเตือนเมื่อมีคำขอรับบริการใหม่</span>
                  </label>

                  <label className="flex items-center space-x-2 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifyOnStatusChange}
                      onChange={(e) => setNotifyOnStatusChange(e.target.checked)}
                      className="rounded text-emerald-500 focus:ring-emerald-500"
                    />
                    <span>แจ้งเตือนเมื่อมีการอัปเดตสถานะงาน</span>
                  </label>

                  <label className="flex items-center space-x-2 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifyOnCompletion}
                      onChange={(e) => setNotifyOnCompletion(e.target.checked)}
                      className="rounded text-emerald-500 focus:ring-emerald-500"
                    />
                    <span>แจ้งเตือนเมื่องานเสร็จสมบูรณ์ / ส่งมอบ</span>
                  </label>

                  <label className="flex items-center space-x-2 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifyOnUrgent}
                      onChange={(e) => setNotifyOnUrgent(e.target.checked)}
                      className="rounded text-emerald-500 focus:ring-emerald-500"
                    />
                    <span>แจ้งเตือนกรณีเป็นงานด่วน / ด่วนที่สุด</span>
                  </label>
                </div>
              </div>

              {lineTestStatus && (
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs border border-emerald-200 dark:border-emerald-800">
                  {lineTestStatus}
                </div>
              )}

              <div className="pt-2 flex flex-wrap items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleTestLineAlert}
                  className="px-4 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-xs font-semibold text-neutral-800 dark:text-neutral-200"
                >
                  ทดสอบระบบส่งแจ้งเตือน
                </button>
                <button
                  type="button"
                  onClick={handleSaveLineSettings}
                  className="px-5 py-2 rounded-xl bg-[#06C755] hover:bg-[#05b34c] text-white text-xs font-semibold shadow-md shadow-emerald-500/20"
                >
                  บันทึกการตั้งค่า LINE
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. Firebase Cloud Database */}
      {activeSubTab === 'firebase' && (
        <div className="space-y-4">
          <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-sm space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                  การเชื่อมต่อ Firebase Firestore (Cloud Database)
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  เชื่อมต่อ Firestore เพื่อบันทึกข้อมูลบน Cloud ถาวรและซิงค์ข้อมูลระหว่างเครื่อง
                </p>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Firebase Project ID
                  </label>
                  <input
                    type="text"
                    value={firebaseProjectId}
                    onChange={(e) => setFirebaseProjectId(e.target.value)}
                    placeholder="เช่น pr-system-2026"
                    className="w-full px-3.5 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs text-neutral-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Web API Key
                  </label>
                  <input
                    type="text"
                    value={firebaseApiKey}
                    onChange={(e) => setFirebaseApiKey(e.target.value)}
                    placeholder="AIzaSy..."
                    className="w-full px-3.5 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs text-neutral-900 dark:text-white"
                  />
                </div>
              </div>

              {firebaseStatus && (
                <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-xs border border-blue-200 dark:border-blue-800">
                  {firebaseStatus}
                </div>
              )}

              <div className="pt-2 flex flex-wrap items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleConnectFirebase}
                  className="px-4 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-xs font-semibold text-neutral-800 dark:text-neutral-200"
                >
                  ทดสอบเชื่อมต่อ Firestore
                </button>
                <button
                  type="button"
                  onClick={handleSyncToFirebase}
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-md shadow-amber-500/20"
                >
                  ซิงค์ข้อมูล {jobs.length} รายการขึ้น Firestore
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
