import Link from 'next/link';
import { Home, Users, Settings, Plus, MailQuestion } from 'lucide-react';

const Sidebar = () => {
  return (
    <div className="h-full w-64 bg-gray-800 text-white fixed">
      <div className="p-4 text-2xl font-bold border-b border-gray-700">
        Admin Panel
      </div>
      <nav className="mt-4 flex flex-col space-y-2 p-4">
        <Link href="/admin" className="flex items-center gap-2 hover:bg-gray-700 p-2 rounded">
          <Home size={18} /> Dashboard
        </Link>
        <Link href="/admin/quiz-build" className="flex items-center gap-2 hover:bg-gray-700 p-2 rounded">
          <Plus size={18} /> Create Quiz
        </Link>
        <Link href="/admin/all-quizes" className="flex items-center gap-2 hover:bg-gray-700 p-2 rounded">
          <MailQuestion size={18} /> All Quizes
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;
