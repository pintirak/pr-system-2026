import React from 'react';
import { Megaphone, Sun, Moon, Plus, Bell, Sparkles } from 'lucide-react';
import { SystemConfig } from '../types';

interface HeaderProps {
  config: SystemConfig;
  onToggleTheme: () => void;
  onOpenNewRequest: () => void;
  activeCount: number;
  urgentCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  config,
  onToggleTheme,
  onOpenNewRequest,
  activeCount,
  urgentCount
}) => {
  const isDark = config.theme === 'dark';

  return (
    <header
      id="app-header"
      className={`sticky top-0 z-30 transition-colors duration-200 border-b ${
        isDark
          ? 'bg-[#1c1c1e]/90 border-neutral-800 text-white'
          : 'bg-white/85 border-neutral-200/80 text-neutral-900'
      } backdrop-blur-xl`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: App Brand & Icon */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <Megaphone className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-base sm:text-lg tracking-tight">PR SYSTEM</span>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                <Sparkles className="w-3 h-3 mr-1" />
                iOS Edition
              </span>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-1">
              {config.organizationName} • {config.prDepartmentName}
            </p>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Urgent tasks badge if any */}
          {urgentCount > 0 && (
            <div
              id="urgent-indicator-badge"
              className="hidden md:flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 animate-pulse"
              title="มีงานด่วนที่ต้องดำเนินการ"
            >
              <Bell className="w-3.5 h-3.5" />
              <span>งานด่วน {urgentCount} รายการ</span>
            </div>
          )}

          {/* Dark / Light Mode Switch (iOS style) */}
          <button
            id="theme-toggle-btn"
            onClick={onToggleTheme}
            className={`p-2 sm:px-3 sm:py-1.5 rounded-full flex items-center space-x-1.5 text-xs font-medium transition-all ${
              isDark
                ? 'bg-neutral-800 text-neutral-200 hover:bg-neutral-700'
                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
            }`}
            aria-label="เปลี่ยนธีม ดาร์กโหมด / ไวท์โหมด"
            title={isDark ? 'สลับเป็นโหมดสว่าง (Light Mode)' : 'สลับเป็นโหมดมืด (Dark Mode)'}
          >
            {isDark ? (
              <>
                <Sun className="w-4 h-4 text-amber-400" />
                <span className="hidden sm:inline">โหมดสว่าง</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-indigo-600" />
                <span className="hidden sm:inline">โหมดมืด</span>
              </>
            )}
          </button>

          {/* New PR Request Button */}
          <button
            id="new-pr-request-header-btn"
            onClick={onOpenNewRequest}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-semibold bg-blue-600 hover:bg-blue-700 active:scale-95 text-white shadow-sm shadow-blue-600/30 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>ขอรับบริการ PR</span>
          </button>
        </div>
      </div>
    </header>
  );
};
