import React, { useState } from 'react';
import { 
  X, 
  Send, 
  Palette, 
  Camera, 
  Share2, 
  Mic, 
  BookOpen, 
  Layers, 
  AlertTriangle, 
  Calendar, 
  Link2, 
  FileText,
  Building2,
  Phone,
  User,
  Check
} from 'lucide-react';
import { PRJob, ServiceCategory, PriorityLevel } from '../types';
import { CATEGORY_INFO, DEPARTMENTS, PRIORITY_INFO } from '../data/seedData';

interface NewRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (newJob: Omit<PRJob, 'id' | 'jobCode' | 'status' | 'progressPercentage' | 'logs'> & { notifyLine: boolean }) => void;
  existingCount: number;
}

export const NewRequestModal: React.FC<NewRequestModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  existingCount
}) => {
  if (!isOpen) return null;

  const today = new Date().toISOString().slice(0, 10);
  const defaultDeadline = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

  const [category, setCategory] = useState<ServiceCategory>('poster');
  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState(DEPARTMENTS[0]);
  const [customDept, setCustomDept] = useState('');
  const [requesterName, setRequesterName] = useState('');
  const [requesterContact, setRequesterContact] = useState('');
  const [requestDate, setRequestDate] = useState(today);
  const [deadlineDate, setDeadlineDate] = useState(defaultDeadline);
  const [eventDate, setEventDate] = useState('');
  const [location, setLocation] = useState('');
  const [priority, setPriority] = useState<PriorityLevel>('normal');
  const [description, setDescription] = useState('');
  const [dimensionOrFormat, setDimensionOrFormat] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [referenceLinks, setReferenceLinks] = useState('');
  const [notifyLine, setNotifyLine] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !requesterName.trim() || !requesterContact.trim()) {
      alert('กรุณากรอกชื่องาน, ผู้ขอรับบริการ และข้อมูลติดต่อให้ครบถ้วน');
      return;
    }

    const finalDept = department === 'other' ? customDept : department;

    onSubmit({
      category,
      title: title.trim(),
      department: finalDept || 'ฝ่ายทั่วไป',
      requesterName: requesterName.trim(),
      requesterContact: requesterContact.trim(),
      requestDate,
      deadlineDate,
      eventDate: eventDate || undefined,
      location: location || undefined,
      priority,
      description: description.trim(),
      dimensionOrFormat: dimensionOrFormat.trim() || undefined,
      targetAudience: targetAudience.trim() || undefined,
      referenceLinks: referenceLinks.trim() || undefined,
      notifyLine
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        id="new-request-modal-sheet"
        className="w-full max-w-2xl bg-white dark:bg-neutral-900 rounded-[2rem] border border-neutral-200 dark:border-neutral-800 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* iOS Grabber & Header */}
        <div className="relative pt-3 pb-4 px-6 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
          <div className="w-12 h-1.5 bg-neutral-300 dark:bg-neutral-700 rounded-full mx-auto absolute left-1/2 -translate-x-1/2 top-2" />
          <div className="pt-2">
            <h3 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white flex items-center space-x-2">
              <span>แบบฟอร์มขอรับบริการงานประชาสัมพันธ์</span>
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              กรอกรายละเอียดงานเพื่อส่งเรื่องเข้าสู่ระบบ PR SYSTEM
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          {/* 1. Category Picker */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
              1. เลือกประเภทบริการงานประชาสัมพันธ์ <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {Object.entries(CATEGORY_INFO).map(([key, info]) => {
                const isSelected = category === key;
                return (
                  <button
                    type="button"
                    key={key}
                    onClick={() => setCategory(key as ServiceCategory)}
                    className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50/60 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 ring-2 ring-blue-500/20'
                        : 'border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/40 text-neutral-700 dark:text-neutral-300 hover:border-neutral-300 dark:hover:border-neutral-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-semibold">{info.label.split('/')[0]}</span>
                      {isSelected && <Check className="w-4 h-4 text-blue-600" />}
                    </div>
                    <span className="text-[10px] text-neutral-500 dark:text-neutral-400 line-clamp-1">
                      {info.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Title */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
              2. ชื่องาน / หัวข้องานประชาสัมพันธ์ <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="เช่น ออกแบบโปสเตอร์ประชาสัมพันธ์งานสัปดาห์วิทยาศาสตร์ 2569"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* 3. Department & Requester info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                หน่วยงาน / สาขาวิชา / กอง <span className="text-red-500">*</span>
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs sm:text-sm text-neutral-900 dark:text-neutral-100"
              >
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
                <option value="other">-- อื่นๆ (ระบุเอง) --</option>
              </select>
              {department === 'other' && (
                <input
                  type="text"
                  placeholder="ระบุชื่อหน่วยงาน..."
                  value={customDept}
                  onChange={(e) => setCustomDept(e.target.value)}
                  className="mt-2 w-full px-3 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs"
                />
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                ชื่อ-สกุล ผู้ขอรับบริการ <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="เช่น อาจารย์ ดร.สมชาย ใจดี"
                value={requesterName}
                onChange={(e) => setRequesterName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-sm text-neutral-900 dark:text-neutral-100"
              />
            </div>
          </div>

          {/* 4. Contact & Deadline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                เบอร์โทรศัพท์ / LINE ID สำหรับติดต่อ <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="เช่น 081-234-5678 (LINE: somchai)"
                value={requesterContact}
                onChange={(e) => setRequesterContact(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-sm text-neutral-900 dark:text-neutral-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                กำหนดส่งมอบงานที่ต้องการ <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                required
                value={deadlineDate}
                onChange={(e) => setDeadlineDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-sm text-neutral-900 dark:text-neutral-100"
              />
            </div>
          </div>

          {/* 5. Priority Level */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
              ระดับความเร่งด่วน
            </label>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(PRIORITY_INFO).map(([key, info]) => {
                const isSelected = priority === key;
                return (
                  <button
                    type="button"
                    key={key}
                    onClick={() => setPriority(key as PriorityLevel)}
                    className={`py-2 px-3 rounded-xl text-xs font-medium border text-center transition-all ${
                      isSelected
                        ? `${info.badge} ring-2 ring-offset-1 ring-blue-500`
                        : 'border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                    }`}
                  >
                    {info.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Event Date & Location (if photography / mc_event) */}
          {(category === 'photography' || category === 'mc_event') && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20">
              <div>
                <label className="block text-xs font-semibold text-amber-900 dark:text-amber-200 mb-1">
                  วันที่จัดกิจกรรม / บันทึกภาพ
                </label>
                <input
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-amber-900 dark:text-amber-200 mb-1">
                  สถานที่จัดงาน
                </label>
                <input
                  type="text"
                  placeholder="เช่น หอประชุมใหญ่ ชั้น 2"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs"
                />
              </div>
            </div>
          )}

          {/* 6. Dimensions / Format & Target Audience */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                ขนาด / สัดส่วน หรือ รูปแบบไฟล์ที่ต้องการ
              </label>
              <input
                type="text"
                placeholder="เช่น A3 พิมพ์, แบนเนอร์ 1200x630, วิดีโอ 16:9"
                value={dimensionOrFormat}
                onChange={(e) => setDimensionOrFormat(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                กลุ่มเป้าหมายของสื่อ
              </label>
              <input
                type="text"
                placeholder="เช่น นักศึกษา, ประชาชนทั่วไป, บุคลากร"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs sm:text-sm"
              />
            </div>
          </div>

          {/* 7. Reference Link */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
              ลิงก์ข้อมูลแนบ / โฟลเดอร์ Google Drive หรือ ตัวอย่างแบบ
            </label>
            <div className="relative">
              <Link2 className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="url"
                placeholder="https://drive.google.com/drive/folders/..."
                value={referenceLinks}
                onChange={(e) => setReferenceLinks(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs sm:text-sm"
              />
            </div>
          </div>

          {/* 8. Description */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
              รายละเอียดและข้อกำหนดเพิ่มเติม
            </label>
            <textarea
              rows={3}
              placeholder="ระบุข้อความหลักที่ต้องการใส่ในสื่อ, โทนสี, โลโก้ที่ต้องมี, หรือข้อควรระวัง..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs sm:text-sm"
            />
          </div>

          {/* LINE Notification Trigger toggle */}
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs">
                LINE
              </div>
              <div>
                <p className="text-xs font-semibold text-emerald-900 dark:text-emerald-300">
                  แจ้งเตือนเข้ากลุ่ม LINE ประชาสัมพันธ์
                </p>
                <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
                  ส่งข้อความสรุปคำขอเข้ากลุ่มงานทันทีหลังบันทึก
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifyLine}
                onChange={(e) => setNotifyLine(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-neutral-300 peer-focus:outline-none rounded-full peer dark:bg-neutral-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
            </label>
          </div>

          {/* Footer Submit Button */}
          <div className="pt-2 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="flex items-center space-x-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 transition-all active:scale-95"
            >
              <Send className="w-4 h-4" />
              <span>บันทึกและส่งคำขอ</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
