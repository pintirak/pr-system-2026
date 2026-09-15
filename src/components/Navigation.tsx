import React from 'react';
import { LayoutDashboard, ListFilter, PlusCircle, BarChart3, Settings } from 'lucide-react';

export type ActiveTab = 'dashboard' | 'list' | 'new_request' | 'monthly_report' | 'settings';

interface NavigationProps {
  activeTab: ActiveTab;
  onChangeTab: (tab: ActiveTab) => void;
  pendingCount: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onChangeTab,
  pendingCount
}) => {
  const tabs: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    {
      id: 'dashboard',
      label: 'แดชบอร์ดงาน',
      icon: <LayoutDashboard className="w-4 h-4" />
    },
    {
      id: 'list',
      label: 'รายการทั้งหมด',
      icon: <ListFilter className="w-4 h-4" />,
      badge: pendingCount > 0 ? pendingCount : undefined
    },
    {
      id: 'new_request',
      label: 'ยื่นคำขอบริการ',
      icon: <PlusCircle className="w-4 h-4" />
    },
    {
      id: 'monthly_report',
      label: 'สรุปผลรายเดือน',
      icon: <BarChart3 className="w-4 h-4" />
    },
    {
      id: 'settings',
      label: 'LINE & GitHub',
      icon: <Settings className="w-4 h-4" />
    }
  ];

  return (
    <>
      {/* Desktop / Tablet Segmented Bar */}
      <nav id="desktop-segmented-navigation" className="hidden sm:block py-4 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="inline-flex p-1 rounded-2xl bg-neutral-200/70 dark:bg-neutral-800/80 backdrop-blur-md border border-neutral-300/40 dark:border-neutral-700/50 shadow-inner">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`tab-${tab.id}`}
                onClick={() => onChangeTab(tab.id)}
                className={`relative flex items-center space-x-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-sm font-semibold'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
                {tab.badge !== undefined && (
                  <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-blue-600 text-white">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Mobile Floating iOS Dock Bar at Bottom */}
      <nav
        id="mobile-ios-dock-navigation"
        className="sm:hidden fixed bottom-0 left-0 right-0 z-40 p-2.5 bg-white/90 dark:bg-[#1c1c1e]/90 backdrop-blur-xl border-t border-neutral-200 dark:border-neutral-800"
      >
        <div className="flex items-center justify-around">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`mobile-tab-${tab.id}`}
                onClick={() => onChangeTab(tab.id)}
                className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all relative ${
                  isActive
                    ? 'text-blue-600 dark:text-blue-400 font-medium'
                    : 'text-neutral-500 dark:text-neutral-400'
                }`}
              >
                <div className="relative">
                  {tab.icon}
                  {tab.badge !== undefined && (
                    <span className="absolute -top-1 -right-2 w-4 h-4 rounded-full text-[9px] font-bold bg-blue-600 text-white flex items-center justify-center">
                      {tab.badge}
                    </span>
                  )}
                </div>
                <span className="text-[10px] mt-1 tracking-tight">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
