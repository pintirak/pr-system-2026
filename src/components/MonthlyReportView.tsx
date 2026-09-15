import React, { useState } from 'react';
import { 
  BarChart3, 
  Calendar, 
  Download, 
  Printer, 
  Copy, 
  Check, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Share2, 
  Palette, 
  Camera, 
  Mic, 
  BookOpen, 
  Layers,
  Award,
  Building2
} from 'lucide-react';
import { PRJob, ServiceCategory } from '../types';
import { 
  getAvailableMonths, 
  formatThaiMonth, 
  calculateMonthlySummary, 
  generateMonthlyCSV 
} from '../lib/monthlyReport';
import { CATEGORY_INFO, STATUS_INFO } from '../data/seedData';

interface MonthlyReportViewProps {
  jobs: PRJob[];
  onSelectJob: (job: PRJob) => void;
}

export const MonthlyReportView: React.FC<MonthlyReportViewProps> = ({
  jobs,
  onSelectJob
}) => {
  const availableMonths = getAvailableMonths(jobs);
  const currentMonth = new Date().toISOString().slice(0, 7);
  const [selectedMonth, setSelectedMonth] = useState<string>(availableMonths[0] || currentMonth);
  const [copiedSummary, setCopiedSummary] = useState(false);

  const summary = calculateMonthlySummary(jobs, selectedMonth);
  const thaiMonthTitle = formatThaiMonth(selectedMonth);

  const handleCopySummary = () => {
    navigator.clipboard.writeText(summary.aiExecutiveSummary);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  const handleDownloadCSV = () => {
    const csv = generateMonthlyCSV(jobs, selectedMonth);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `pr_report_${selectedMonth}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  const getCategoryIcon = (cat: ServiceCategory) => {
    switch (cat) {
      case 'poster': return <Palette className="w-3.5 h-3.5 text-blue-500" />;
      case 'photography': return <Camera className="w-3.5 h-3.5 text-amber-500" />;
      case 'facebook_pr': return <Share2 className="w-3.5 h-3.5 text-indigo-500" />;
      case 'mc_event': return <Mic className="w-3.5 h-3.5 text-rose-500" />;
      case 'print_media': return <BookOpen className="w-3.5 h-3.5 text-emerald-500" />;
      default: return <Layers className="w-3.5 h-3.5 text-neutral-500" />;
    }
  };

  return (
    <div id="monthly-report-view" className="space-y-6 pb-12 print:p-0">
      {/* Top Controls Header */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            <span>สรุปผลการดำเนินงานประชาสัมพันธ์ประจำเดือน</span>
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            ระบบวิเคราะห์และประมวลผลสถิติงานบริการ PR อัตโนมัติ
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Month Selector */}
          <div className="flex items-center space-x-1.5 bg-neutral-100 dark:bg-neutral-800 px-3 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-700">
            <Calendar className="w-4 h-4 text-neutral-400" />
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-transparent text-xs font-semibold text-neutral-900 dark:text-white focus:outline-none cursor-pointer"
            >
              {availableMonths.map((m) => (
                <option key={m} value={m} className="dark:bg-neutral-900 text-neutral-900 dark:text-white">
                  {formatThaiMonth(m)}
                </option>
              ))}
            </select>
          </div>

          {/* Export Buttons */}
          <button
            onClick={handleDownloadCSV}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200 transition-colors"
            title="ดาวน์โหลดข้อมูลเป็นไฟล์ Excel / CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span>ส่งออก CSV</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/20 transition-all"
            title="พิมพ์รายงานหรือบันทึกเป็น PDF"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>พิมพ์รายงาน / PDF</span>
          </button>
        </div>
      </div>

      {/* Printable Report Header */}
      <div className="hidden print:block text-center border-b pb-4 mb-4">
        <h1 className="text-xl font-bold">รายงานสรุปผลการดำเนินงานบริการงานประชาสัมพันธ์</h1>
        <p className="text-sm text-neutral-600">ประจำเดือน {thaiMonthTitle}</p>
      </div>

      {/* Auto Executive Summary Widget (iOS Style) */}
      <section className="p-5 rounded-3xl bg-gradient-to-br from-blue-50/70 via-indigo-50/40 to-white dark:from-blue-950/30 dark:via-neutral-900 dark:to-neutral-900 border border-blue-200/80 dark:border-blue-900/60 shadow-sm relative overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2 text-blue-700 dark:text-blue-300 font-bold text-xs sm:text-sm">
            <Sparkles className="w-4 h-4" />
            <span>บทสรุปผู้บริหารอัตโนมัติ (Executive Summary)</span>
          </div>
          <button
            onClick={handleCopySummary}
            className="flex items-center space-x-1 text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline print:hidden"
          >
            {copiedSummary ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedSummary ? 'คัดลอกแล้ว' : 'คัดลอกข้อความสรุป'}</span>
          </button>
        </div>

        <p className="text-xs sm:text-sm text-neutral-800 dark:text-neutral-200 whitespace-pre-line leading-relaxed">
          {summary.aiExecutiveSummary}
        </p>
      </section>

      {/* Monthly KPIs Grid */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-sm">
          <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">คำขอทั้งหมดในเดือน</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white">{summary.totalJobs}</span>
            <span className="text-xs text-neutral-500">ภารกิจ</span>
          </div>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-sm">
          <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">อัตราความสำเร็จ</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-bold text-emerald-600 dark:text-emerald-400">{summary.completionRate}%</span>
            <span className="text-xs text-emerald-600">{summary.completedJobs} งานสำเร็จ</span>
          </div>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-sm">
          <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">ระยะเวลาเฉลี่ยต่อภารกิจ</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400">{summary.avgTurnaroundDays}</span>
            <span className="text-xs text-blue-500">วันทำการ</span>
          </div>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-sm">
          <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">ยอดการเข้าถึงสะสม (Reach)</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-bold text-purple-600 dark:text-purple-400">
              {summary.totalReach.toLocaleString()}
            </span>
            <span className="text-xs text-purple-500">ครั้ง</span>
          </div>
        </div>
      </section>

      {/* Two Column Visual Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Category Breakdown */}
        <div className="p-5 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-sm space-y-4">
          <h3 className="text-xs sm:text-sm font-bold text-neutral-900 dark:text-white flex items-center space-x-2">
            <Palette className="w-4 h-4 text-blue-500" />
            <span>สัดส่วนประเภทงานบริการประชาสัมพันธ์</span>
          </h3>

          <div className="space-y-3 pt-1">
            {Object.entries(summary.categoryBreakdown).map(([key, count]) => {
              const info = CATEGORY_INFO[key as ServiceCategory];
              const percentage = summary.totalJobs > 0 ? Math.round((count / summary.totalJobs) * 100) : 0;

              return (
                <div key={key} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-1.5 text-neutral-700 dark:text-neutral-300">
                      {getCategoryIcon(key as ServiceCategory)}
                      <span className="font-medium">{info.label}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-neutral-900 dark:text-white">{count} งาน</span>
                      <span className="text-neutral-400 text-[11px]">({percentage}%)</span>
                    </div>
                  </div>
                  <div className="w-full h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%`, backgroundColor: info.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Requesting Departments */}
        <div className="p-5 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-sm space-y-4">
          <h3 className="text-xs sm:text-sm font-bold text-neutral-900 dark:text-white flex items-center space-x-2">
            <Building2 className="w-4 h-4 text-indigo-500" />
            <span>หน่วยงานที่มีการขอรับบริการสูงสุด (Top 5)</span>
          </h3>

          <div className="space-y-3 pt-1">
            {summary.topDepartments.length === 0 ? (
              <p className="text-xs text-neutral-400 text-center py-8">ไม่มีข้อมูลในเดือนนี้</p>
            ) : (
              summary.topDepartments.map((dept, index) => {
                const maxCount = summary.topDepartments[0]?.count || 1;
                const barWidth = Math.round((dept.count / maxCount) * 100);

                return (
                  <div key={dept.name} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-2">
                        <span className="w-5 h-5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 flex items-center justify-center font-bold text-[10px]">
                          {index + 1}
                        </span>
                        <span className="font-medium text-neutral-800 dark:text-neutral-200 line-clamp-1">{dept.name}</span>
                      </div>
                      <span className="font-bold text-neutral-900 dark:text-white shrink-0">{dept.count} งาน</span>
                    </div>
                    <div className="w-full h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-indigo-500 transition-all duration-500"
                        style={{ width: `${barWidth}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Monthly Highlight Jobs */}
      {summary.highlightJobs.length > 0 && (
        <section className="p-5 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-sm space-y-3">
          <h3 className="text-xs sm:text-sm font-bold text-neutral-900 dark:text-white flex items-center space-x-2">
            <Award className="w-4 h-4 text-amber-500" />
            <span>ไฮไลท์ภารกิจเด่นประจำเดือน {thaiMonthTitle}</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {summary.highlightJobs.map((job) => (
              <div
                key={job.id}
                onClick={() => onSelectJob(job)}
                className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/70 dark:border-neutral-700/60 hover:border-blue-500 transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-mono font-bold text-blue-600 dark:text-blue-400">{job.jobCode}</span>
                  <span className="text-[10px] text-neutral-500">{job.department}</span>
                </div>
                <h4 className="font-semibold text-xs sm:text-sm text-neutral-900 dark:text-white line-clamp-1">
                  {job.title}
                </h4>
                <div className="mt-2 flex items-center justify-between text-[11px] text-neutral-500">
                  <span>ผู้ขอ: {job.requesterName}</span>
                  {job.reachImpressions ? (
                    <span className="font-medium text-purple-600 dark:text-purple-400">
                      Reach: {job.reachImpressions.toLocaleString()}
                    </span>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
