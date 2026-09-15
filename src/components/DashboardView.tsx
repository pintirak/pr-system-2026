import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Flame, 
  ArrowRight, 
  User, 
  Layers, 
  Palette, 
  Camera, 
  Share2, 
  Mic, 
  BookOpen, 
  Filter,
  Calendar,
  Sparkles
} from 'lucide-react';
import { PRJob, JobStatus, ServiceCategory } from '../types';
import { CATEGORY_INFO, STATUS_INFO, PRIORITY_INFO } from '../data/seedData';

interface DashboardViewProps {
  jobs: PRJob[];
  onSelectJob: (job: PRJob) => void;
  onAdvanceStatus: (job: PRJob, nextStatus: JobStatus) => void;
  onOpenNewRequest: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  jobs,
  onSelectJob,
  onAdvanceStatus,
  onOpenNewRequest
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // KPIs
  const totalCount = jobs.length;
  const pendingCount = jobs.filter(j => j.status === 'pending').length;
  const inProgressCount = jobs.filter(j => j.status === 'in_progress').length;
  const reviewCount = jobs.filter(j => j.status === 'review').length;
  const completedCount = jobs.filter(j => j.status === 'completed' || j.status === 'delivered').length;
  const urgentCount = jobs.filter(j => (j.priority === 'urgent' || j.priority === 'urgent_critical') && j.status !== 'completed').length;
  const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Filtered jobs
  const filteredJobs = selectedCategory === 'all' 
    ? jobs 
    : jobs.filter(j => j.category === selectedCategory);

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

  const stages: { status: JobStatus; title: string; color: string; desc: string }[] = [
    { status: 'pending', title: '1. รับเรื่อง / รอดำเนินการ', color: 'border-amber-500', desc: 'คำขอใหม่ รอตรวจสอบและมอบหมาย' },
    { status: 'in_progress', title: '2. กำลังจัดทำ / ออกแบบ', color: 'border-blue-500', desc: 'ทีม ปชส. กำลังดำเนินการผลิต' },
    { status: 'review', title: '3. รอตรวจทาน / แก้ไข', color: 'border-purple-500', desc: 'ส่งแบบร่างให้ผู้ขอยืนยัน' },
    { status: 'delivered', title: '4. ส่งมอบ / เผยแพร่แล้ว', color: 'border-teal-500', desc: 'อัปโหลดสื่อหรือส่งไฟล์' },
    { status: 'completed', title: '5. เสร็จสมบูรณ์', color: 'border-emerald-500', desc: 'ปิดงานพร้อมบันทึกสถิติ' },
  ];

  const getNextStatus = (current: JobStatus): JobStatus | null => {
    if (current === 'pending') return 'in_progress';
    if (current === 'in_progress') return 'review';
    if (current === 'review') return 'delivered';
    if (current === 'delivered') return 'completed';
    return null;
  };

  return (
    <div id="pr-dashboard-view" className="space-y-6 pb-12">
      {/* Top iOS Widgets Grid */}
      <section className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        {/* Widget 1: Total */}
        <div className="p-4 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-sm">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 text-xs font-medium">
            <span>ภารกิจทั้งหมด</span>
            <div className="w-7 h-7 rounded-full bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">{totalCount}</span>
            <span className="text-xs text-neutral-500 font-medium">รายการ</span>
          </div>
        </div>

        {/* Widget 2: In Progress */}
        <div className="p-4 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-sm">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 text-xs font-medium">
            <span>กำลังดำเนินการ</span>
            <div className="w-7 h-7 rounded-full bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-blue-600 dark:text-blue-400">{inProgressCount}</span>
            <span className="text-xs text-blue-500 font-medium">{pendingCount} รอตอบรับ</span>
          </div>
        </div>

        {/* Widget 3: Review */}
        <div className="p-4 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-sm">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 text-xs font-medium">
            <span>รอตรวจทาน / แก้</span>
            <div className="w-7 h-7 rounded-full bg-purple-50 dark:bg-purple-950/50 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-purple-600 dark:text-purple-400">{reviewCount}</span>
            <span className="text-xs text-purple-500 font-medium">ส่งดราฟท์แล้ว</span>
          </div>
        </div>

        {/* Widget 4: Completed */}
        <div className="p-4 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-sm">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 text-xs font-medium">
            <span>ส่งมอบ / สำเร็จ</span>
            <div className="w-7 h-7 rounded-full bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">{completedCount}</span>
            <span className="text-xs text-emerald-600 font-medium">{completionRate}% สำเร็จ</span>
          </div>
        </div>

        {/* Widget 5: Urgent Flag */}
        <div className="col-span-2 lg:col-span-1 p-4 rounded-3xl bg-gradient-to-br from-red-500/10 via-amber-500/5 to-transparent border border-red-500/30 dark:border-red-500/20 shadow-sm">
          <div className="flex items-center justify-between text-red-700 dark:text-red-400 text-xs font-medium">
            <span>งานด่วน / ด่วนที่สุด</span>
            <div className="w-7 h-7 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center text-red-600 dark:text-red-300">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-red-600 dark:text-red-400">{urgentCount}</span>
            <span className="text-xs text-red-600 dark:text-red-400 font-medium">ต้องติดตามด่วน</span>
          </div>
        </div>
      </section>

      {/* Category Filter Pills (iOS style) */}
      <section className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
        <div className="flex items-center text-xs text-neutral-500 dark:text-neutral-400 mr-1 pl-1">
          <Filter className="w-3.5 h-3.5 mr-1" />
          <span>กรองบริการ:</span>
        </div>
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
            selectedCategory === 'all'
              ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-sm'
              : 'bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 border border-neutral-200 dark:border-neutral-700'
          }`}
        >
          ทั้งหมด ({jobs.length})
        </button>
        {Object.entries(CATEGORY_INFO).map(([key, info]) => {
          const count = jobs.filter(j => j.category === key).length;
          return (
            <button
              key={key}
              onClick={() => setSelectedCategory(key)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === key
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-sm'
                  : 'bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 border border-neutral-200 dark:border-neutral-700'
              }`}
            >
              {getCategoryIcon(key as ServiceCategory)}
              <span>{info.label.split('/')[0]}</span>
              <span className="text-[11px] opacity-70">({count})</span>
            </button>
          );
        })}
      </section>

      {/* Real-time Workflow Kanban Pipeline (5 Stages) */}
      <section className="overflow-x-auto pb-4">
        <div className="flex space-x-4 min-w-[1100px]">
          {stages.map((stage) => {
            const stageJobs = filteredJobs.filter(j => j.status === stage.status);
            const statusConfig = STATUS_INFO[stage.status];

            return (
              <div
                key={stage.status}
                id={`kanban-column-${stage.status}`}
                className="flex-1 bg-neutral-100/70 dark:bg-neutral-900/60 rounded-3xl p-3 border border-neutral-200/70 dark:border-neutral-800 flex flex-col max-h-[750px]"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-3 px-1 border-b border-neutral-200/50 dark:border-neutral-800/60 mb-3">
                  <div>
                    <h3 className="font-semibold text-xs sm:text-sm text-neutral-900 dark:text-neutral-100 flex items-center">
                      <span className={`w-2.5 h-2.5 rounded-full mr-2`} style={{ backgroundColor: statusConfig.color }} />
                      {stage.title}
                    </h3>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400 line-clamp-1">{stage.desc}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                    {stageJobs.length}
                  </span>
                </div>

                {/* Cards Container */}
                <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                  {stageJobs.length === 0 ? (
                    <div className="h-36 flex flex-col items-center justify-center text-center p-4 border border-dashed border-neutral-300 dark:border-neutral-700/60 rounded-2xl text-neutral-400 dark:text-neutral-500 text-xs">
                      <span>ไม่มีภารกิจในขั้นตอนนี้</span>
                    </div>
                  ) : (
                    stageJobs.map((job) => {
                      const priorityConfig = PRIORITY_INFO[job.priority];
                      const categoryInfo = CATEGORY_INFO[job.category];
                      const nextStatus = getNextStatus(job.status);

                      return (
                        <div
                          key={job.id}
                          id={`job-card-${job.id}`}
                          onClick={() => onSelectJob(job)}
                          className="group p-3.5 rounded-2xl bg-white dark:bg-neutral-800 border border-neutral-200/80 dark:border-neutral-700/80 hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-md transition-all cursor-pointer relative"
                        >
                          {/* Top Badges */}
                          <div className="flex items-center justify-between gap-1 mb-2">
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300">
                              {job.jobCode}
                            </span>
                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-medium ${priorityConfig.badge}`}>
                              {priorityConfig.label}
                            </span>
                          </div>

                          {/* Title */}
                          <h4 className="font-semibold text-xs sm:text-sm text-neutral-900 dark:text-neutral-100 line-clamp-2 mb-1.5 leading-snug">
                            {job.title}
                          </h4>

                          {/* Category & Department */}
                          <div className="flex items-center space-x-1.5 text-[11px] text-neutral-500 dark:text-neutral-400 mb-2">
                            {getCategoryIcon(job.category)}
                            <span className="line-clamp-1">{categoryInfo?.label.split('/')[0]} • {job.department}</span>
                          </div>

                          {/* Progress bar */}
                          <div className="space-y-1 mb-2.5">
                            <div className="flex items-center justify-between text-[10px] text-neutral-500 dark:text-neutral-400">
                              <span>ความคืบหน้า</span>
                              <span className="font-semibold">{job.progressPercentage}%</span>
                            </div>
                            <div className="w-full h-1.5 bg-neutral-100 dark:bg-neutral-700 rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full transition-all duration-300"
                                style={{
                                  width: `${job.progressPercentage}%`,
                                  backgroundColor: statusConfig.color
                                }}
                              />
                            </div>
                          </div>

                          {/* Bottom Info & Quick Advance */}
                          <div className="pt-2 border-t border-neutral-100 dark:border-neutral-700/60 flex items-center justify-between text-[11px]">
                            <div className="flex items-center text-neutral-500 dark:text-neutral-400">
                              <Calendar className="w-3 h-3 mr-1" />
                              <span>ส่ง {job.deadlineDate.slice(5)}</span>
                            </div>

                            {/* Quick Next Stage Action Button */}
                            {nextStatus ? (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onAdvanceStatus(job, nextStatus);
                                }}
                                className="flex items-center space-x-1 px-2 py-1 rounded-lg text-[10px] font-medium bg-neutral-100 dark:bg-neutral-700 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 text-neutral-700 dark:text-neutral-200 transition-colors"
                                title={`เลื่อนสถานะเป็น "${STATUS_INFO[nextStatus].label}"`}
                              >
                                <span>ถัดไป</span>
                                <ArrowRight className="w-3 h-3" />
                              </button>
                            ) : (
                              <span className="text-emerald-600 dark:text-emerald-400 flex items-center text-[10px] font-medium">
                                <CheckCircle2 className="w-3 h-3 mr-0.5" />
                                เรียบร้อย
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
