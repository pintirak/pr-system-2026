import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Calendar, 
  User, 
  ExternalLink, 
  Palette, 
  Camera, 
  Share2, 
  Mic, 
  BookOpen, 
  Layers, 
  ChevronRight,
  ArrowUpDown
} from 'lucide-react';
import { PRJob, JobStatus, ServiceCategory, PriorityLevel } from '../types';
import { CATEGORY_INFO, STATUS_INFO, PRIORITY_INFO } from '../data/seedData';

interface RequestListViewProps {
  jobs: PRJob[];
  onSelectJob: (job: PRJob) => void;
  onOpenNewRequest: () => void;
}

export const RequestListView: React.FC<RequestListViewProps> = ({
  jobs,
  onSelectJob,
  onOpenNewRequest
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'deadline' | 'date_desc' | 'priority'>('deadline');

  const getCategoryIcon = (cat: ServiceCategory) => {
    switch (cat) {
      case 'poster': return <Palette className="w-4 h-4 text-blue-500" />;
      case 'photography': return <Camera className="w-4 h-4 text-amber-500" />;
      case 'facebook_pr': return <Share2 className="w-4 h-4 text-indigo-500" />;
      case 'mc_event': return <Mic className="w-4 h-4 text-rose-500" />;
      case 'print_media': return <BookOpen className="w-4 h-4 text-emerald-500" />;
      default: return <Layers className="w-4 h-4 text-neutral-500" />;
    }
  };

  // Filter
  const filtered = jobs.filter(job => {
    const matchesSearch = 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.jobCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.requesterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.department.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = selectedStatus === 'all' || job.status === selectedStatus;
    const matchesCategory = selectedCategory === 'all' || job.category === selectedCategory;
    const matchesPriority = selectedPriority === 'all' || job.priority === selectedPriority;

    return matchesSearch && matchesStatus && matchesCategory && matchesPriority;
  });

  // Sort
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'deadline') {
      return a.deadlineDate.localeCompare(b.deadlineDate);
    }
    if (sortBy === 'date_desc') {
      return b.requestDate.localeCompare(a.requestDate);
    }
    if (sortBy === 'priority') {
      const pScore = (p: PriorityLevel) => (p === 'urgent_critical' ? 3 : p === 'urgent' ? 2 : 1);
      return pScore(b.priority) - pScore(a.priority);
    }
    return 0;
  });

  return (
    <div id="request-list-view" className="space-y-4 pb-12">
      {/* Search and Filters Header */}
      <div className="p-4 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-sm space-y-3">
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            id="job-search-input"
            type="text"
            placeholder="ค้นหาตามรหัสงาน, ชื่องาน, ผู้ขอรับบริการ, หรือหน่วยงาน..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-neutral-100 dark:bg-neutral-800 border-none text-xs sm:text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>

        {/* Filter Controls */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
          {/* Status filter */}
          <div>
            <label className="block text-[11px] font-medium text-neutral-500 dark:text-neutral-400 mb-1">
              สถานะดำเนินงาน
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-xs bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 border border-neutral-200 dark:border-neutral-700"
            >
              <option value="all">ทุกสถานะ ({jobs.length})</option>
              {Object.entries(STATUS_INFO).map(([st, info]) => (
                <option key={st} value={st}>{info.label}</option>
              ))}
            </select>
          </div>

          {/* Category filter */}
          <div>
            <label className="block text-[11px] font-medium text-neutral-500 dark:text-neutral-400 mb-1">
              ประเภทบริการ
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-xs bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 border border-neutral-200 dark:border-neutral-700"
            >
              <option value="all">ทุกประเภทบริการ</option>
              {Object.entries(CATEGORY_INFO).map(([cat, info]) => (
                <option key={cat} value={cat}>{info.label}</option>
              ))}
            </select>
          </div>

          {/* Priority filter */}
          <div>
            <label className="block text-[11px] font-medium text-neutral-500 dark:text-neutral-400 mb-1">
              ระดับความด่วน
            </label>
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-xs bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 border border-neutral-200 dark:border-neutral-700"
            >
              <option value="all">ทุกระดับ</option>
              {Object.entries(PRIORITY_INFO).map(([p, info]) => (
                <option key={p} value={p}>{info.label}</option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-[11px] font-medium text-neutral-500 dark:text-neutral-400 mb-1">
              เรียงลำดับ
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl text-xs bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 border border-neutral-200 dark:border-neutral-700"
            >
              <option value="deadline">กำหนดส่งมอบ (เร็วสุด)</option>
              <option value="date_desc">วันที่ยื่นขอ (ล่าสุด)</option>
              <option value="priority">ความเร่งด่วนสูงสุด</option>
            </select>
          </div>
        </div>
      </div>

      {/* Result Count */}
      <div className="flex items-center justify-between px-1 text-xs text-neutral-500 dark:text-neutral-400">
        <span>พบรายการงาน {sorted.length} จากทั้งหมด {jobs.length} รายการ</span>
        <button
          onClick={onOpenNewRequest}
          className="text-blue-600 dark:text-blue-400 font-medium hover:underline text-xs"
        >
          + ยื่นคำขอรับบริการใหม่
        </button>
      </div>

      {/* List / Cards Layout */}
      {sorted.length === 0 ? (
        <div className="py-16 text-center rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-8">
          <p className="text-neutral-500 dark:text-neutral-400 text-sm">ไม่พบงานที่ตรงกับเงื่อนไขการค้นหา</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sorted.map((job) => {
            const statusConfig = STATUS_INFO[job.status];
            const priorityConfig = PRIORITY_INFO[job.priority];
            const categoryInfo = CATEGORY_INFO[job.category];

            return (
              <div
                key={job.id}
                id={`list-item-${job.id}`}
                onClick={() => onSelectJob(job)}
                className="p-4 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-md transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                {/* Left: Icon & Main Info */}
                <div className="flex items-start space-x-3.5 flex-1 min-w-0">
                  <div
                    className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-sm"
                    style={{ backgroundColor: `${categoryInfo.color}15`, color: categoryInfo.color }}
                  >
                    {getCategoryIcon(job.category)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded-md text-[11px] font-mono font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200">
                        {job.jobCode}
                      </span>
                      <span className={`px-2 py-0.5 rounded-md text-[11px] font-medium ${priorityConfig.badge}`}>
                        {priorityConfig.label}
                      </span>
                      <span className="text-xs text-neutral-500 dark:text-neutral-400">
                        {categoryInfo?.label.split('/')[0]}
                      </span>
                    </div>

                    <h4 className="font-semibold text-sm sm:text-base text-neutral-900 dark:text-neutral-100 line-clamp-1">
                      {job.title}
                    </h4>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                      <span>หน่วยงาน: <strong className="text-neutral-700 dark:text-neutral-300 font-medium">{job.department}</strong></span>
                      <span>ผู้ขอ: {job.requesterName}</span>
                      {job.assignedOfficer && (
                        <span className="text-blue-600 dark:text-blue-400">ผู้รับผิดชอบ: {job.assignedOfficer.split('(')[0]}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Status, Deadline & Progress */}
                <div className="flex items-center justify-between md:justify-end space-x-4 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-neutral-100 dark:border-neutral-800">
                  {/* Progress & Deadline */}
                  <div className="text-left md:text-right min-w-[130px]">
                    <div className="flex items-center md:justify-end space-x-1 text-xs text-neutral-500 dark:text-neutral-400">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>ส่ง: {job.deadlineDate}</span>
                    </div>
                    <div className="mt-1 flex items-center space-x-2">
                      <div className="w-20 h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${job.progressPercentage}%`, backgroundColor: statusConfig.color }}
                        />
                      </div>
                      <span className="text-[11px] font-semibold text-neutral-700 dark:text-neutral-300">
                        {job.progressPercentage}%
                      </span>
                    </div>
                  </div>

                  {/* Status Pill */}
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusConfig.bgLight} ${statusConfig.bgDark} whitespace-nowrap`}
                  >
                    {statusConfig.label}
                  </span>

                  <ChevronRight className="w-5 h-5 text-neutral-400 hidden sm:block" />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
