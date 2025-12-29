
import React from 'react';
import { ViewType } from '../types';

interface SidebarProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange }) => {
  const items = [
    { id: 'dashboard', label: 'แผงควบคุม', icon: '📊' },
    { id: 'products', label: 'สินค้าของฉัน', icon: '📦' },
    { id: 'alerts', label: 'แจ้งเตือนราคา', icon: '🔔' },
    { id: 'settings', label: 'ตั้งค่าบอท', icon: '⚙️' },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen fixed left-0 top-0 flex flex-col">
      <div className="p-6 border-b border-gray-100">
        <h1 className="text-xl font-bold text-blue-600 flex items-center gap-2">
          <span>🕵️‍♂️</span> PriceSpy AI
        </h1>
        <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider font-bold">ระบบสายสืบคู่แข่งอัจฉริยะ</p>
      </div>
      
      <nav className="flex-1 mt-4 px-4 space-y-1">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id as ViewType)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              currentView === item.id 
                ? 'bg-blue-50 text-blue-600 font-bold' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-6 border-t border-gray-100">
        <div className="bg-green-50 rounded-xl p-4">
          <div className="flex items-center gap-2 text-green-700 text-xs font-bold mb-1">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            สถานะบอท: ทำงานอยู่
          </div>
          <p className="text-[10px] text-green-600 leading-tight">
            n8n Worker กำลังตรวจสอบราคาจาก 12 คู่แข่งทุกๆ ชั่วโมง
          </p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
