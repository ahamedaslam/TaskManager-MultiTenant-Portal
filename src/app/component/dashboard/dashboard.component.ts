import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';

type TaskStatus = 'Todo' | 'In Progress' | 'Review' | 'Done';
type Priority = 'High' | 'Medium' | 'Low';

interface Tenant {
  id: number;
  name: string;
  plan: string;
  color: string;
}

interface StatCard {
  label: string;
  value: number;
  suffix?: string;
  delta: number;
  icon: string;
  tone: string;
  trend: number[];
}

interface Task {
  title: string;
  project: string;
  status: TaskStatus;
  priority: Priority;
  due: string;
  progress: number;
  assignees: string[];
}

interface Member {
  name: string;
  role: string;
  load: number;
  online: boolean;
}

interface Activity {
  who: string;
  action: string;
  target: string;
  time: string;
  tone: string;
}

// Lucide-style stroke icons (24x24 viewBox)
const ICONS = {
  grid: 'M3 3h7v7H3z M14 3h7v7h-7z M14 14h7v7h-7z M3 14h7v7H3z',
  tasks: 'M9 11l3 3L22 4 M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11',
  folder: 'M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z',
  users: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M5 7a4 4 0 1 0 8 0a4 4 0 1 0-8 0 M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75',
  calendar: 'M3 6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M16 2v4 M8 2v4 M3 10h18',
  chart: 'M3 3v18h18 M18 17V9 M13 17V5 M8 17v-3',
  settings: 'M4 21v-7 M4 10V3 M12 21v-9 M12 8V3 M20 21v-5 M20 12V3 M1 14h6 M9 8h6 M17 16h6',
  search: 'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16z M21 21l-4.35-4.35',
  bell: 'M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 0 1-3.46 0',
  moon: 'M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z',
  sun: 'M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10z M12 1v2 M12 21v2 M4.22 4.22l1.42 1.42 M18.36 18.36l1.42 1.42 M1 12h2 M21 12h2 M4.22 19.78l1.42-1.42 M18.36 5.64l1.42-1.42',
  plus: 'M12 5v14 M5 12h14',
  chevron: 'M6 9l6 6 6-6',
  menu: 'M3 12h18 M3 6h18 M3 18h18',
  clock: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z M12 6v6l4 2',
  alert: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z M12 8v4 M12 16h.01',
  zap: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z',
  logout: 'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4 M16 17l5-5-5-5 M21 12H9',
  more: 'M12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2z M19 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2z M5 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2z',
  building: 'M3 21h18 M5 21V7l8-4v18 M19 21V11l-6-4 M9 9v.01 M9 12v.01 M9 15v.01 M9 18v.01',
  check: 'M20 6L9 17l-5-5'
};

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  icons = ICONS;

  darkMode = localStorage.getItem('theme') === 'dark';
  sidebarOpen = false;
  tenantMenuOpen = false;

  userName = 'Aslam';
  today = new Date();

  navItems = [
    { label: 'Dashboard', icon: 'grid', active: true },
    { label: 'My Tasks', icon: 'tasks', badge: 12 },
    { label: 'Projects', icon: 'folder' },
    { label: 'Team', icon: 'users' },
    { label: 'Calendar', icon: 'calendar' },
    { label: 'Reports', icon: 'chart' },
    { label: 'Settings', icon: 'settings' }
  ];

  tenants: Tenant[] = [
    { id: 1, name: 'Acme Corp', plan: 'Enterprise', color: '#6366f1' },
    { id: 2, name: 'Globex Labs', plan: 'Business', color: '#ec4899' },
    { id: 3, name: 'Initech', plan: 'Starter', color: '#14b8a6' }
  ];
  selectedTenant: Tenant = this.tenants[0];

  stats: StatCard[] = [
    { label: 'Total Tasks', value: 248, delta: 12.5, icon: 'tasks', tone: 'indigo', trend: [18, 22, 19, 26, 24, 30, 34] },
    { label: 'Completed', value: 186, delta: 8.2, icon: 'check', tone: 'green', trend: [10, 14, 13, 18, 20, 22, 27] },
    { label: 'In Progress', value: 42, delta: -3.1, icon: 'zap', tone: 'amber', trend: [12, 10, 14, 11, 9, 10, 8] },
    { label: 'Overdue', value: 7, delta: -18.4, icon: 'alert', tone: 'rose', trend: [9, 8, 10, 7, 6, 8, 5] }
  ];

  weekly = [
    { day: 'Mon', created: 14, done: 10 },
    { day: 'Tue', created: 18, done: 15 },
    { day: 'Wed', created: 12, done: 16 },
    { day: 'Thu', created: 22, done: 17 },
    { day: 'Fri', created: 16, done: 21 },
    { day: 'Sat', created: 6, done: 8 },
    { day: 'Sun', created: 4, done: 5 }
  ];

  breakdown = [
    { label: 'Done', value: 186, color: 'var(--c-green)' },
    { label: 'In Progress', value: 42, color: 'var(--c-amber)' },
    { label: 'Review', value: 13, color: 'var(--c-indigo)' },
    { label: 'Overdue', value: 7, color: 'var(--c-rose)' }
  ];

  filters: Array<'All' | TaskStatus> = ['All', 'In Progress', 'Review', 'Todo', 'Done'];
  activeFilter: 'All' | TaskStatus = 'All';

  tasks: Task[] = [
    { title: 'Tenant onboarding flow', project: 'Core Platform', status: 'In Progress', priority: 'High', due: 'Oct 15', progress: 68, assignees: ['Aslam Ahamed', 'Priya Nair'] },
    { title: 'Role-based access control', project: 'Security', status: 'Review', priority: 'High', due: 'Oct 16', progress: 90, assignees: ['Rahul Menon'] },
    { title: 'OTP rate limiting', project: 'Security', status: 'Todo', priority: 'Medium', due: 'Oct 20', progress: 0, assignees: ['Sara Khan', 'Rahul Menon'] },
    { title: 'Billing webhook handler', project: 'Payments', status: 'In Progress', priority: 'Medium', due: 'Oct 22', progress: 35, assignees: ['Vikram Rao'] },
    { title: 'Dashboard analytics API', project: 'Reporting', status: 'Done', priority: 'Low', due: 'Oct 10', progress: 100, assignees: ['Priya Nair'] },
    { title: 'Email notification templates', project: 'Core Platform', status: 'Todo', priority: 'Low', due: 'Oct 28', progress: 0, assignees: ['Sara Khan'] }
  ];

  team: Member[] = [
    { name: 'Priya Nair', role: 'Frontend Lead', load: 82, online: true },
    { name: 'Rahul Menon', role: 'Backend Engineer', load: 64, online: true },
    { name: 'Sara Khan', role: 'QA Engineer', load: 45, online: false },
    { name: 'Vikram Rao', role: 'DevOps', load: 91, online: true }
  ];

  activity: Activity[] = [
    { who: 'Priya Nair', action: 'completed', target: 'Dashboard analytics API', time: '12m ago', tone: 'green' },
    { who: 'Rahul Menon', action: 'moved to review', target: 'Role-based access control', time: '48m ago', tone: 'indigo' },
    { who: 'Vikram Rao', action: 'commented on', target: 'Billing webhook handler', time: '2h ago', tone: 'amber' },
    { who: 'Sara Khan', action: 'was assigned', target: 'OTP rate limiting', time: '5h ago', tone: 'rose' }
  ];

  deadlines = [
    { title: 'Sprint 14 demo', date: new Date(2026, 9, 15), tag: 'Meeting' },
    { title: 'RBAC security audit', date: new Date(2026, 9, 16), tag: 'Review' },
    { title: 'v2.0 release', date: new Date(2026, 9, 24), tag: 'Release' }
  ];

  constructor(private router: Router) {}

  get greeting(): string {
    const h = this.today.getHours();
    return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
  }

  get filteredTasks(): Task[] {
    return this.activeFilter === 'All'
      ? this.tasks
      : this.tasks.filter(t => t.status === this.activeFilter);
  }

  get completionRate(): number {
    const total = this.breakdown.reduce((s, b) => s + b.value, 0);
    return Math.round((this.breakdown[0].value / total) * 100);
  }

  // Donut segments: circumference of r=52 circle
  get donutSegments() {
    const c = 2 * Math.PI * 52;
    const total = this.breakdown.reduce((s, b) => s + b.value, 0);
    let offset = 0;
    return this.breakdown.map(b => {
      const len = (b.value / total) * c;
      const seg = { ...b, dash: `${Math.max(len - 3, 0)} ${c}`, offset: -offset };
      offset += len;
      return seg;
    });
  }

  get weeklyMax(): number {
    return Math.max(...this.weekly.map(w => Math.max(w.created, w.done)));
  }

  sparkline(points: number[], w = 100, h = 32): string {
    const max = Math.max(...points);
    const min = Math.min(...points);
    const step = w / (points.length - 1);
    return points
      .map((p, i) => {
        const x = i * step;
        const y = h - ((p - min) / (max - min || 1)) * (h - 4) - 2;
        return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');
  }

  sparkArea(points: number[], w = 100, h = 32): string {
    return `${this.sparkline(points, w, h)} L${w},${h} L0,${h} Z`;
  }

  icon(name: string): string {
    return (ICONS as Record<string, string>)[name] ?? '';
  }

  initials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  }

  avatarHue(name: string): number {
    let hash = 0;
    for (const ch of name) hash = ch.charCodeAt(0) + ((hash << 5) - hash);
    return Math.abs(hash) % 360;
  }

  daysLeft(date: Date): number {
    return Math.ceil((date.getTime() - this.today.getTime()) / 86400000);
  }

  slug(value: string): string {
    return value.toLowerCase().replace(/\s+/g, '-');
  }

  selectTenant(t: Tenant): void {
    this.selectedTenant = t;
    this.tenantMenuOpen = false;
  }

  toggleTheme(): void {
    this.darkMode = !this.darkMode;
    localStorage.setItem('theme', this.darkMode ? 'dark' : 'light');
  }

  logout(): void {
    sessionStorage.removeItem('accessToken');
    this.router.navigate(['/login']);
  }

  @HostListener('document:click', ['$event'])
  closeMenus(e: MouseEvent): void {
    if (!(e.target as HTMLElement).closest('.tenant-switcher')) {
      this.tenantMenuOpen = false;
    }
  }
}
