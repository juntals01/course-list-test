'use client';

import React from 'react';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import {
  Search,
  LayoutDashboard,
  BarChart3,
  Building2,
  Users,
  CreditCard,
  FileText,
  ClipboardList,
  ShieldCheck,
  GraduationCap,
  AlertTriangle,
  HardHat,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

type NavItem = {
  label: string;
  icon: React.ReactNode;
};

type AppItem = {
  label: string;
  icon: React.ReactNode;
  color: string;
  active?: boolean;
};

const portalNavItems: NavItem[] = [
  { label: 'Dashboard', icon: <LayoutDashboard size={16} /> },
  { label: 'Reports', icon: <BarChart3 size={16} /> },
  { label: 'Company Management', icon: <Building2 size={16} /> },
  { label: 'User Management', icon: <Users size={16} /> },
  { label: 'Billing', icon: <CreditCard size={16} /> },
];

/* Figma icon spec: w:28 h:28 border-radius:99 padding:4px → 20px inner icon area → icon size 16px */
const appItems: AppItem[] = [
  { label: 'Policies and Procedures', icon: <FileText size={16} />, color: '#6da017' },
  { label: 'Forms', icon: <ClipboardList size={16} />, color: '#08a273' },
  { label: 'Inspections', icon: <ShieldCheck size={16} />, color: '#337cf3' },
  { label: 'Training', icon: <GraduationCap size={16} />, color: '#FEB836', active: true },
  { label: 'Hazards', icon: <AlertTriangle size={16} />, color: '#EF4444' },
  { label: 'Contractors', icon: <HardHat size={16} />, color: '#F97316' },
];

type SidebarProps = {
  collapsed?: boolean;
  onToggle?: () => void;
};

export default function Sidebar({ collapsed = false, onToggle }: SidebarProps) {
  return (
    <div className="relative flex flex-col h-full border-r border-gray-200">
      {/* Top section: Logo + Search + Portal Management | pt:12 gap:20 border-b pb:16 */}
      <div className="flex flex-col pt-3 pb-4 gap-5 border-b border-gray-200">
        {/* Logo */}
        <div className="px-4">
          <Image
            src="/logo.png"
            alt="Your Safety Partners"
            width={110}
            height={44}
            className="object-contain"
            priority
          />
        </div>

        {/* Search: w:238 h:41 py:12 rounded:8 border:1 */}
        <div className="relative px-4">
          <div className="absolute left-7 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            <Search size={14} />
          </div>
          <Input
            placeholder="Find anything"
            className="bg-white border border-gray-300 rounded-lg h-[41px] text-sm pl-9 pr-3 py-3 shadow-none ring-0 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-400"
          />
        </div>

        {/* Portal Management: gap:8 */}
        <div className="flex flex-col gap-2">
          {/* Label: px:16 | 12px, weight:800, leading:100%, tracking:0% */}
          <p className="px-4 text-[12px] font-extrabold text-[#6B7280] uppercase leading-none tracking-normal">
            Portal Management
          </p>
          <nav className="flex flex-col gap-2">
            {portalNavItems.map((item) => (
              <button
                key={item.label}
                className="flex items-center gap-2.5 px-4 py-[6px] rounded-md text-sm font-normal leading-[1.5] text-[#4B5563] hover:bg-gray-100 transition-colors w-full text-left"
              >
                <span className="w-4 h-4 flex items-center justify-center text-[#6B7280] shrink-0">
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Apps section: pt:16 pb:24 gap:8 border-b */}
      <div className="flex flex-col pt-4 pb-6 gap-2 border-b border-gray-200">
        {/* Label: px:16 | 12px, weight:800, leading:100%, tracking:0% */}
        <p className="px-4 text-[12px] font-extrabold text-[#6B7280] uppercase leading-none tracking-normal">
          Apps
        </p>
        {/* App items: icon w:28 h:28 rounded:99 p:4 | gap between icon and text: 10px */}
        <nav className="flex flex-col gap-2">
          {appItems.map((item) => (
            <button
              key={item.label}
              className={`flex items-center gap-2.5 px-4 py-[6px] rounded-md text-sm font-normal leading-[1.5] transition-colors w-full text-left ${
                item.active
                  ? 'bg-[#FFF8F0] text-[var(--training-primary)] font-medium'
                  : 'text-[#4B5563] hover:bg-gray-100'
              }`}
            >
              <span
                className="w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-white p-1"
                style={{ backgroundColor: item.color }}
              >
                {item.icon}
              </span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Version — border-top divider, pushed to bottom */}
      <div className="mt-auto border-t border-gray-200 px-4 pt-4 pb-6">
        <p className="text-[11px] text-gray-400 leading-relaxed">Current Version</p>
        <p className="text-[11px] text-gray-400 leading-relaxed">v1.1.0</p>
      </div>

      {/* Collapse chevron: 24x24, #6D28D9, only left corners rounded, lower bottom */}
      <div className="absolute bottom-24 -right-0 z-10">
        <button
          onClick={onToggle}
          className="w-6 h-6 p-1 bg-[#6D28D9] text-white flex items-center justify-center hover:bg-[#5B21B6] transition-colors"
          style={{ borderTopLeftRadius: '4px', borderBottomLeftRadius: '4px', borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>
    </div>
  );
}
