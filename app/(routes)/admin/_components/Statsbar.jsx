'use client';
import useGlobalContextProvider from '@/app/_context/ContextApi';
import { FileText, Radio, Users } from 'lucide-react'; // Lucide icons

export default function DashboardStats({ stats }) {
  const { allQuiz } = useGlobalContextProvider();
  const { totalQuizzes, liveQuizzes, totalParticipants } = stats;

  const cards = [
    {
      label: 'Total Quizzes',
      value: allQuiz?.length,
      icon: <FileText className="w-6 h-6 text-green-600" />,
    },
    {
      label: 'Live Quizzes',
      value: allQuiz?.length,
      icon: <Radio className="w-6 h-6 text-blue-600" />,
    },
    {
      label: 'Participants',
      value: totalParticipants,
      icon: <Users className="w-6 h-6 text-purple-600" />,
    },
  ];

  return (
    
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 py-4">
      {cards.map((card, idx) => (
        <div
          key={idx}
          className="bg-white border rounded-lg shadow-md px-5 py-8 flex items-center gap-4"
        >
          <div className="p-3 bg-gray-100 rounded-full">{card.icon}</div>
          <div>
            <div className="text-sm text-gray-500">{card.label}</div>
            <div className="text-xl font-semibold">{card.value}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
