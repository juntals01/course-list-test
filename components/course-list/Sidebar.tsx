'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';

type NavItem = {
  label: string;
  icon: string;
};

type AppItem = {
  label: string;
  icon: string;
  color: string;
  /** Light/pastel background for the icon circle (matches reference design) */
  iconBg: string;
  href?: string;
  activePrefix?: string;
  activeHighlight?: string;
  activeTextColor?: string;
};

const portalNavItems: NavItem[] = [
  { label: 'Dashboard', icon: '/icons/dashboard.png' },
  { label: 'Reports', icon: '/icons/reports.png' },
  { label: 'Company Management', icon: '/icons/company.png' },
  { label: 'User Management', icon: '/icons/users.png' },
  { label: 'Billing', icon: '/icons/billing.png' },
];

/* Icon circles use light/pastel backgrounds; color is used for accent (left border, active state) */
const appItems: AppItem[] = [
  { label: 'Policies and Procedures', icon: '/icons/policies-sidebar.png', color: '#6da017', iconBg: '#E0F0D4', href: '/policies/articles', activePrefix: '/policies', activeHighlight: '#F5F9EB', activeTextColor: 'var(--policiesAndProcedures-primary)' },
  { label: 'Forms', icon: '/icons/forms.png', color: '#08a273', iconBg: '#D1F0E8' },
  { label: 'Inspections', icon: '/icons/inspection.png', color: '#337cf3', iconBg: '#D4E3FC' },
  { label: 'Training', icon: '/icons/training.png', color: '#FEB836', iconBg: '#FFF0D6', href: '/training/courses', activePrefix: '/training', activeHighlight: '#FFF8F0', activeTextColor: 'var(--training-primary)' },
  { label: 'Hazards', icon: '/icons/hazards.png', color: '#EF4444', iconBg: '#FDE2E2' },
  { label: 'Contractors', icon: '/icons/contractors.png', color: '#F97316', iconBg: '#FFEDD5' },
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
      <div className="flex flex-col pt-3 pb-3 gap-4 border-b border-gray-200">
        {/* Logo — dimensions match source (114×64) to avoid blur from wrong aspect ratio; use 2x asset for retina */}
        <div className="px-4">
          <Image
            src="/logo2.png"
            alt="Your Safety Partners"
            width={114}
            height={64}
            className="object-contain"
            priority
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

        {/* Portal Management — icons from public/icons */}
        <div className="flex flex-col gap-1.5 pt-1">
          <p className="px-4 text-[11px] font-extrabold text-[#9CA3AF] uppercase leading-none tracking-wider">
            Portal Management
          </p>
          <nav className="flex flex-col gap-1">
            {portalNavItems.map((item) => (
              <button
                key={item.label}
                className="flex items-center gap-2.5 px-4 py-2.5 rounded-md text-[13px] font-normal leading-[1.5] text-[#4B5563] hover:bg-gray-100 transition-colors w-full text-left"
              >
                <span className="w-4 h-4 flex items-center justify-center shrink-0">
                  <Image src={item.icon} alt="" width={16} height={16} className="object-contain" />
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
                  className="w-7 h-7 rounded-full shrink-0 flex items-center justify-center p-1"
                  style={{ backgroundColor: item.iconBg }}
                >
                  <Image src={item.icon} alt="" width={16} height={16} className="object-contain" />
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
