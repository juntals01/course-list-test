'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  GraduationCap,
  ChevronRight,
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
      icon: (
        <Image
          src="/icons/policies-sidebar.png"
          alt=""
          width={20}
          height={20}
          className="object-contain"
        />
      ),
      iconBg: 'bg-[#F3F7EB]',
      avatarBg: 'bg-[var(--policiesAndProcedures-primary)]',
    };
  }
  return {
    name: 'Training',
    icon: <GraduationCap size={20} className="text-white" />,
    iconBg: 'bg-[var(--training-primary)]',
    avatarBg: 'bg-[#6D28D9]',
  };
}

function getBreadcrumb(pathname: string): string[] {
  if (pathname.startsWith('/policies')) {
    if (pathname === '/policies/articles/add') return ['Master Articles', 'Active Articles', 'Add Article'];
    if (pathname.match(/^\/policies\/articles\/\d+\/edit/)) return ['Master Articles', 'Active Articles', 'Edit Article'];
    if (pathname.match(/^\/policies\/articles\/\d+$/)) return ['Master Articles', 'Psychological Health Management'];
    if (pathname === '/policies/articles/archived') return ['Master Articles', 'Archived Articles'];
    if (pathname === '/policies/articles/company') return ['Master Articles', 'Company Articles'];
    if (pathname === '/policies/articles/site') return ['Master Articles', 'Site Articles'];
    if (pathname.startsWith('/policies/articles')) return ['Master Articles', 'Active Articles'];
    if (pathname === '/policies/categories/archived') return ['Master Categories', 'Archived Categories'];
    if (pathname.startsWith('/policies/categories')) return ['Master Categories', 'Active Categories'];
    if (pathname.startsWith('/policies/settings')) return ['Settings'];
    if (pathname === '/policies/view') return ['View Policies & Procedures'];
    return ['Master Articles', 'Active Articles'];
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
  const router = useRouter();
  const isArticles = pathname.startsWith('/policies/articles');
  const isCategories = pathname.startsWith('/policies/categories');
  const isViewPage = pathname === '/policies/view';
  const isCopiedArticles = pathname === '/policies/articles/company';
  const isMasterArticlesActive = isArticles && !isCopiedArticles;

  const tabsActiveClass = 'text-[#6DA017] font-medium bg-[#6DA0171A]';
  const tabsInactiveClass = 'text-[#6B7280] hover:text-[#6DA017] hover:bg-[#6DA0171A]';

  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center gap-2 h-[45px]">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className={cn(
                'h-[45px] min-w-[125px] px-3 py-3 rounded-[4px] text-[14px] leading-[1.5] transition-colors outline-none ring-0 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0',
                isMasterArticlesActive ? tabsActiveClass : tabsInactiveClass
              )}
            >
              Master Articles
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-[200px]">
            <DropdownMenuItem asChild>
              <Link href="/policies/articles" className={cn('text-sm cursor-pointer w-full', pathname === '/policies/articles' && 'text-[var(--policiesAndProcedures-primary)] font-medium')}>
                Active Articles
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

        <Link
          href="/policies/articles/company"
          className={cn(
            'h-[45px] min-w-[126px] px-3 py-3 rounded-[4px] text-[14px] font-normal leading-[1.5] flex items-center transition-colors',
            isCopiedArticles ? tabsActiveClass : tabsInactiveClass
          )}
        >
          Copied Articles
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className={cn(
                'h-[45px] min-w-[125px] px-3 py-3 rounded-[4px] text-[14px] leading-[1.5] transition-colors outline-none ring-0 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0',
                isCategories ? tabsActiveClass : tabsInactiveClass
              )}
            >
              Master Categories
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

      </div>
      <div className="hidden items-center gap-2">
        <span className="text-sm text-[#6B7280]">View Policies & Procedures</span>
        <Switch
          checked={isViewPage}
          onCheckedChange={(checked) => {
            if (checked) {
              router.push('/policies/view');
            } else {
              router.push('/policies/articles');
            }
          }}
          className="data-[state=checked]:bg-[var(--policiesAndProcedures-primary)]"
        />
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
  useEffect(() => {
    const id = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(id);
  }, []);

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
          sidebarCollapsed ? 'md:w-0' : 'md:w-[271px]'
        )}
      >
        <div className="w-[271px] h-full">
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
        {/* Navbar — h-68, rounded-t 4px, border-b 1px, py-4 px-6; breadcrumb gap-2 h-9; icon 36px circle p-2, 20px icon; name font-semibold text-sm leading-[150%]; caret ~10px; crumb text regular 14px */}
        <div className="flex items-center justify-between min-h-[68px] h-[68px] px-6 py-4 border-b border-gray-200 rounded-tl-[4px] rounded-tr-[4px]">
          <div className="flex items-center gap-2 h-9 text-sm">
            <div className="flex items-center gap-2 h-9 shrink-0">
              <span className={cn('w-9 h-9 rounded-full flex items-center justify-center shrink-0 p-2', moduleConfig.iconBg)}>
                {moduleConfig.icon}
              </span>
              <span className="font-semibold text-[14px] leading-[1.5] text-[#374151]">{moduleConfig.name}</span>
            </div>
            <span className="hidden md:flex items-center gap-2 h-9 text-[#6B7280]">
              {breadcrumb.map((crumb, i) => (
                <React.Fragment key={i}>
                  <ChevronRight size={15} className="text-[#000000] shrink-0" />
                  <span className="font-normal text-[14px] leading-[1.5]">{crumb}</span>
                </React.Fragment>
              ))}
            </span>
          </div>
          <div className="flex items-center gap-[10px]">
            <button className="w-[30px] h-[30px] p-[6px] flex items-center justify-center rounded-md text-[#6D28D9] hover:bg-gray-100 transition-colors shrink-0" aria-label="Book">
              <Image src="/icons/book.png" alt="" width={18} height={18} className="object-contain w-[18px] h-[18px]" style={{ filter: 'brightness(0) saturate(100%) invert(27%) sepia(51%) saturate(5000%) hue-rotate(250deg)' }} />
            </button>
            <button className="w-[30px] h-[30px] p-[6px] flex items-center justify-center rounded-md text-[#6D28D9] hover:bg-gray-100 transition-colors shrink-0" aria-label="Help">
              <Image src="/icons/question-mark.png" alt="" width={18} height={18} className="object-contain w-[18px] h-[18px]" style={{ filter: 'brightness(0) saturate(100%) invert(27%) sepia(51%) saturate(5000%) hue-rotate(250deg)' }} />
            </button>
            <div className="w-px h-5 bg-[#E5E7EB] shrink-0" aria-hidden />
            <div className="w-8 h-8 rounded-full bg-[#D1D5DB] text-[#374151] text-[14px] font-normal leading-[1] flex items-center justify-center shrink-0 p-2">
              GT
            </div>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-auto flex flex-col">
          {mounted ? (
            <>
              {showTabs && (
                <div className="min-h-[69px] flex flex-col justify-center gap-2 px-4 py-3 border-b border-gray-200 rounded-tl-[4px] rounded-tr-[4px]">
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
