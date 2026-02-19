'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  GraduationCap,
  FileText,
  ChevronRight,
  Grid3X3,
  HelpCircle,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Switch } from '@/components/ui/switch';

import { cn } from '@/lib/utils';
import Sidebar from '@/components/course-list/Sidebar';

type ModuleConfig = {
  name: string;
  icon: React.ReactNode;
  iconBg: string;
  avatarBg: string;
};

function getModuleConfig(pathname: string): ModuleConfig {
  if (pathname.startsWith('/policies')) {
    return {
      name: 'Policies and Procedures',
      icon: <FileText size={12} />,
      iconBg: 'bg-[var(--policiesAndProcedures-primary)]',
      avatarBg: 'bg-[var(--policiesAndProcedures-primary)]',
    };
  }
  return {
    name: 'Training',
    icon: <GraduationCap size={12} />,
    iconBg: 'bg-[var(--training-primary)]',
    avatarBg: 'bg-[#6D28D9]',
  };
}

function getBreadcrumb(pathname: string): string[] {
  if (pathname.startsWith('/policies')) {
    if (pathname === '/policies/articles/add') return ['Articles', 'Active Articles', 'Add Article'];
    if (pathname.match(/^\/policies\/articles\/\d+\/edit/)) return ['Articles', 'Active Articles', 'Edit Article'];
    if (pathname.match(/^\/policies\/articles\/\d+$/)) return ['Policies', 'Psychological Health Management'];
    if (pathname === '/policies/articles/archived') return ['Articles', 'Archived Articles'];
    if (pathname === '/policies/articles/company') return ['Articles', 'Company Articles'];
    if (pathname === '/policies/articles/site') return ['Articles', 'Site Articles'];
    if (pathname.startsWith('/policies/articles')) return ['Articles', 'All Articles'];
    if (pathname === '/policies/categories/archived') return ['Categories', 'Archived Categories'];
    if (pathname.startsWith('/policies/categories')) return ['Categories', 'Active Categories'];
    if (pathname.startsWith('/policies/settings')) return ['Settings'];
    return ['Articles', 'All Articles'];
  }

  if (pathname.match(/^\/training\/job-roles\/\d+\/edit/)) return ['Job Roles List', 'Edit Job Role'];
  if (pathname === '/training/job-roles/add') return ['Job Roles List', 'Add Job Role'];
  if (pathname.startsWith('/training/job-roles/archived')) return ['Job Roles List', 'Archived Job Roles'];
  if (pathname.startsWith('/training/job-roles')) return ['Job Roles List', 'Active Job Roles'];

  if (pathname === '/training/courses/add') return ['Courses List', 'Add Free Course'];
  if (pathname === '/training/courses/paid/add') return ['Courses List', 'Add Premium Course'];
  if (pathname.match(/^\/training\/courses\/\d+/)) return ['Courses List', 'View Course'];
  if (pathname.startsWith('/training/courses/paid')) return ['Courses List', 'Paid Courses'];
  if (pathname.startsWith('/training/courses/archived')) return ['Courses List', 'Archived Courses'];
  return ['Courses List', 'Free Courses'];
}

function TrainingTabs({ pathname }: { pathname: string }) {
  const isJobRoles = pathname.startsWith('/training/job-roles');
  const isCourses = pathname.startsWith('/training/courses');

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className={cn(
              'text-sm px-4 py-2 rounded-md transition-colors outline-none ring-0 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0',
              isJobRoles
                ? 'text-[var(--training-primary)] font-medium bg-[#FFF7ED]'
                : 'text-[#6B7280] hover:text-[var(--training-primary)] hover:bg-[#FFF7ED]/50'
            )}
          >
            Job Role List
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-[180px]">
          <DropdownMenuItem asChild>
            <Link href="/training/job-roles" className={cn('text-sm cursor-pointer w-full', pathname === '/training/job-roles' && 'text-[var(--training-primary)] font-medium')}>
              Active Job Roles
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/training/job-roles/archived" className={cn('text-sm cursor-pointer w-full', pathname === '/training/job-roles/archived' && 'text-[var(--training-primary)] font-medium')}>
              Archived Job Roles
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className={cn(
              'text-sm px-4 py-2 rounded-md transition-colors outline-none ring-0 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0',
              isCourses
                ? 'text-[var(--training-primary)] font-medium bg-[#FFF7ED]'
                : 'text-[#6B7280] hover:text-[var(--training-primary)] hover:bg-[#FFF7ED]/50'
            )}
          >
            Courses List
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-[180px]">
          <DropdownMenuItem asChild>
            <Link href="/training/courses" className={cn('text-sm cursor-pointer w-full', pathname === '/training/courses' && 'text-[var(--training-primary)] font-medium')}>
              Free Courses
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/training/courses/paid" className={cn('text-sm cursor-pointer w-full', pathname === '/training/courses/paid' && 'text-[var(--training-primary)] font-medium')}>
              Paid Courses
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/training/courses/archived" className={cn('text-sm cursor-pointer w-full', pathname === '/training/courses/archived' && 'text-[var(--training-primary)] font-medium')}>
              Archived Courses
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function PoliciesTabs({ pathname }: { pathname: string }) {
  const isArticles = pathname.startsWith('/policies/articles');
  const isCategories = pathname.startsWith('/policies/categories');
  const isSettings = pathname.startsWith('/policies/settings');

  const activeClass = 'text-[var(--policiesAndProcedures-primary)] font-medium bg-[#F5F9EB]';
  const inactiveClass = 'text-[#6B7280] hover:text-[var(--policiesAndProcedures-primary)] hover:bg-[#F5F9EB]/50';

  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className={cn(
                'text-sm px-4 py-2 rounded-md transition-colors outline-none ring-0 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0',
                isArticles ? activeClass : inactiveClass
              )}
            >
              Articles
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-[200px]">
            <DropdownMenuItem asChild>
              <Link href="/policies/articles" className={cn('text-sm cursor-pointer w-full', pathname === '/policies/articles' && 'text-[var(--policiesAndProcedures-primary)] font-medium')}>
                All Articles
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/policies/articles/company" className={cn('text-sm cursor-pointer w-full', pathname === '/policies/articles/company' && 'text-[var(--policiesAndProcedures-primary)] font-medium')}>
                Company Articles
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/policies/articles/site" className={cn('text-sm cursor-pointer w-full', pathname === '/policies/articles/site' && 'text-[var(--policiesAndProcedures-primary)] font-medium')}>
                Site Articles
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/policies/articles/archived" className={cn('text-sm cursor-pointer w-full', pathname === '/policies/articles/archived' && 'text-[var(--policiesAndProcedures-primary)] font-medium')}>
                Archived Articles
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className={cn(
                'text-sm px-4 py-2 rounded-md transition-colors outline-none ring-0 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0',
                isCategories ? activeClass : inactiveClass
              )}
            >
              Categories
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-[180px]">
            <DropdownMenuItem asChild>
              <Link href="/policies/categories" className={cn('text-sm cursor-pointer w-full', pathname === '/policies/categories' && 'text-[var(--policiesAndProcedures-primary)] font-medium')}>
                Active Categories
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/policies/categories/archived" className={cn('text-sm cursor-pointer w-full', pathname === '/policies/categories/archived' && 'text-[var(--policiesAndProcedures-primary)] font-medium')}>
                Archived Categories
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Link
          href="/policies/settings"
          className={cn(
            'text-sm px-4 py-2 rounded-md transition-colors',
            isSettings ? activeClass : inactiveClass
          )}
        >
          Settings
        </Link>
      </div>
      <div className="hidden md:flex items-center gap-2">
        <span className="text-sm text-[#6B7280]">View Policies & Procedures</span>
        <Switch className="data-[state=checked]:bg-[var(--policiesAndProcedures-primary)]" />
      </div>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const moduleConfig = getModuleConfig(pathname);
  const breadcrumb = getBreadcrumb(pathname);

  const isPolicies = pathname.startsWith('/policies');
  const isTraining = pathname.startsWith('/training');

  const isDetailOrFormPage =
    pathname === '/training/courses/add' ||
    pathname === '/training/courses/paid/add' ||
    pathname === '/training/job-roles/add' ||
    /^\/training\/courses\/\d+/.test(pathname) ||
    /^\/training\/job-roles\/\d+\/edit/.test(pathname);

  const isPoliciesFormPage =
    pathname === '/policies/articles/add' ||
    /^\/policies\/articles\/\d+\/edit/.test(pathname) ||
    /^\/policies\/articles\/\d+$/.test(pathname);

  const showTabs = (isPolicies && !isPoliciesFormPage) || (isTraining && !isDetailOrFormPage);

  return (
    <div className="flex min-h-screen w-full bg-white font-sans">
      {/* Sidebar - hidden on mobile */}
      <aside
        className={cn(
          'hidden md:block shrink-0 bg-white relative transition-all duration-300 ease-in-out overflow-hidden',
          sidebarCollapsed ? 'md:w-0' : 'md:w-[270px]'
        )}
      >
        <div className="w-[270px] h-full">
          <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed((prev) => !prev)} />
        </div>
      </aside>
      {sidebarCollapsed && (
        <div className="hidden md:block relative z-10">
          <button
            onClick={() => setSidebarCollapsed(false)}
            className="absolute top-1/2 -translate-y-1/2 left-0 w-6 h-6 p-1 bg-[#6D28D9] text-white flex items-center justify-center hover:bg-[#5B21B6] transition-colors"
            style={{ borderTopRightRadius: '4px', borderBottomRightRadius: '4px', borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
          >
            <ChevronRight size={14} />
          </button>
        </div>
      )}

      <main className="flex-1 min-w-0 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 md:px-6 py-3 border-b border-gray-200">
          <div className="flex items-center gap-2 text-sm text-[#6B7280]">
            <span className={cn('w-5 h-5 rounded-full flex items-center justify-center text-white', moduleConfig.iconBg)}>
              {moduleConfig.icon}
            </span>
            <span className="text-[#374151] font-medium">{moduleConfig.name}</span>
            <span className="hidden md:contents">
              {breadcrumb.map((crumb, i) => (
                <React.Fragment key={i}>
                  <ChevronRight size={14} className="text-gray-400" />
                  <span>{crumb}</span>
                </React.Fragment>
              ))}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button className="w-8 h-8 flex items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 transition-colors">
              <Grid3X3 size={18} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 transition-colors">
              <HelpCircle size={18} />
            </button>
            <div className="w-8 h-8 rounded-full bg-[#6D28D9] text-white text-xs font-semibold flex items-center justify-center">
              GT
            </div>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-auto flex flex-col">
          {mounted ? (
            <>
              {showTabs && (
                <div className="px-4 md:px-6 py-3 border-b border-gray-200">
                  {isPolicies ? (
                    <PoliciesTabs pathname={pathname} />
                  ) : (
                    <TrainingTabs pathname={pathname} />
                  )}
                </div>
              )}
              {children}
            </>
          ) : (
            <div className="flex-1" />
          )}
        </div>
      </main>
    </div>
  );
}
