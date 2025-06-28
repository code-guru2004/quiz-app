import Link from 'next/link';
import { Home, Plus, MailQuestion } from 'lucide-react';
import ThemeToggle from '@/components/shared/ModeToggle';

const Sidebar = () => {
  return (
    <div className="h-full w-64 bg-gray-800 text-white fixed shadow-md">
      <div className="p-4 text-2xl font-bold border-b border-gray-700">
        Admin Panel
        {/* <ThemeToggle/> */}
      </div>
      <nav className="mt-4 flex flex-col space-y-1 px-4">
        <SidebarLink href="/admin" icon={<Home size={18} />} label="Dashboard" />
        <SidebarLink href="/admin/quiz-build" icon={<Plus size={18} />} label="Create Quiz" />
        <SidebarLink href="/admin/all-quizes" icon={<MailQuestion size={18} />} label="All Quizes" />
      </nav>
    </div>
  );
};

const SidebarLink = ({ href, icon, label }) => {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 p-2 rounded-md transition-colors duration-200 
                 hover:bg-gray-700 hover:text-white"
    >
      {icon}
      <span className="text-sm">{label}</span>
    </Link>
  );
};

export default Sidebar;
