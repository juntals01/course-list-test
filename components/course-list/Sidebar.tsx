'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
  href?: string;
  activePrefix?: string;
  activeHighlight?: string;
  activeTextColor?: string;
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
  { label: 'Policies and Procedures', icon: <FileText size={16} />, color: '#6da017', href: '/policies/articles', activePrefix: '/policies', activeHighlight: '#F5F9EB', activeTextColor: 'var(--policiesAndProcedures-primary)' },
  { label: 'Forms', icon: <ClipboardList size={16} />, color: '#08a273' },
  { label: 'Inspections', icon: <ShieldCheck size={16} />, color: '#337cf3' },
  { label: 'Training', icon: <GraduationCap size={16} />, color: '#FEB836', href: '/training/courses', activePrefix: '/training', activeHighlight: '#FFF8F0', activeTextColor: 'var(--training-primary)' },
  { label: 'Hazards', icon: <AlertTriangle size={16} />, color: '#EF4444' },
  { label: 'Contractors', icon: <HardHat size={16} />, color: '#F97316' },
];

type SidebarProps = {
  collapsed?: boolean;
  onToggle?: () => void;
};

export default function Sidebar({ collapsed = false, onToggle }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div className="relative flex flex-col h-full border-r border-gray-200">
      {/* Top section: Logo + Search + Portal Management */}
      <div className="flex flex-col pt-4 pb-3 gap-4 border-b border-gray-200">
        {/* Logo */}
        <div className="px-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt="Your Safety Partners"
            width={110}
            height={44}
            className="object-contain"
          />
        </div>

        {/* Search */}
        <div className="relative px-4">
          <div className="absolute left-7 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            <Search size={14} />
          </div>
          <Input
            placeholder="Find anything"
            className="bg-white border border-gray-300 rounded-md h-[36px] text-[13px] pl-9 pr-3 py-2 shadow-none ring-0 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-400"
          />
        </div>

        {/* Portal Management */}
        <div className="flex flex-col gap-1.5 pt-1">
          <p className="px-4 text-[11px] font-extrabold text-[#9CA3AF] uppercase leading-none tracking-wider">
            Portal Management
          </p>
          <nav className="flex flex-col gap-0.5">
            {portalNavItems.map((item) => (
              <button
                key={item.label}
                className="flex items-center gap-2.5 px-4 py-[6px] rounded-md text-[13px] font-normal leading-[1.5] text-[#4B5563] hover:bg-gray-100 transition-colors w-full text-left"
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

      {/* Apps section */}
      <div className="flex flex-col pt-5 pb-8 gap-2 border-b border-gray-200">
        <p className="px-4 text-[11px] font-extrabold text-[#9CA3AF] uppercase leading-none tracking-wider">
          Apps
        </p>
        <nav className="flex flex-col gap-0.5">
          {appItems.map((item) => {
            const isActive = item.activePrefix ? pathname.startsWith(item.activePrefix) : false;
            const cls = isActive
              ? 'flex items-center gap-2.5 px-4 py-[6px] text-[13px] font-medium leading-[1.5] transition-colors w-full text-left border-l-[3px]'
              : 'flex items-center gap-2.5 px-4 py-[6px] text-[13px] font-normal leading-[1.5] transition-colors w-full text-left border-l-[3px] border-l-transparent text-[#4B5563] hover:bg-gray-100';
            const style = isActive
              ? { backgroundColor: item.activeHighlight, color: item.activeTextColor, borderLeftColor: item.color }
              : undefined;
            const content = (
              <>
                <span
                  className="w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-white p-1"
                  style={{ backgroundColor: item.color }}
                >
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </>
            );
            return item.href ? (
              <Link key={item.label} href={item.href} className={cls} style={style}>
                {content}
              </Link>
            ) : (
              <button key={item.label} className={cls} style={style}>
                {content}
              </button>
            );
          })}
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
