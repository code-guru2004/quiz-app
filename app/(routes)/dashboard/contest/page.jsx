import Link from "next/link";
import { ArrowRight, Trophy, Calendar, Sun } from "lucide-react";

export default function ContestPage() {
  const contests = [
    {
      type: "daily",
      title: "Daily Quiz",
      description: "A fresh challenge every day. 25 questions · 50 minutes",
      icon: <Sun className="w-6 h-6" />,
      light: {
        bgGradient: "from-amber-50 to-orange-50",
        borderColor: "border-orange-200",
        textColor: "text-orange-600",
        iconBg: "bg-orange-100",
        iconColor: "text-orange-600",
      },
      dark: {
        bgGradient: "from-amber-900/20 to-orange-900/20",
        borderColor: "border-orange-800/30",
        textColor: "text-orange-400",
        iconBg: "bg-orange-900/30",
        iconColor: "text-orange-400",
      }
    },
    {
      type: "weekly",
      title: "Weekly Quiz",
      description: "Test yourself weekly. 30 questions · 60 minutes",
      icon: <Calendar className="w-6 h-6" />,
      light: {
        bgGradient: "from-blue-50 to-cyan-50",
        borderColor: "border-blue-200",
        textColor: "text-blue-600",
        iconBg: "bg-blue-100",
        iconColor: "text-blue-600",
      },
      dark: {
        bgGradient: "from-blue-900/20 to-cyan-900/20",
        borderColor: "border-blue-800/30",
        textColor: "text-blue-400",
        iconBg: "bg-blue-900/30",
        iconColor: "text-blue-400",
      }
    },
    {
      type: "monthly",
      title: "Monthly Quiz",
      description: "Big challenge of the month. 50 questions · 100 minutes",
      icon: <Trophy className="w-6 h-6" />,
      light: {
        bgGradient: "from-purple-50 to-violet-50",
        borderColor: "border-purple-200",
        textColor: "text-purple-600",
        iconBg: "bg-purple-100",
        iconColor: "text-purple-600",
      },
      dark: {
        bgGradient: "from-purple-900/20 to-violet-900/20",
        borderColor: "border-purple-800/30",
        textColor: "text-purple-400",
        iconBg: "bg-purple-900/30",
        iconColor: "text-purple-400",
      }
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      {/* Background elements - different for light/dark */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-purple-300/20 dark:bg-purple-900/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 dark:opacity-30 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-blue-300/20 dark:bg-blue-900/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 dark:opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-8 left-1/3 w-72 h-72 bg-orange-300/20 dark:bg-orange-900/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 dark:opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      {/* Header section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          Challenge Your Knowledge
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Choose your contest type and compete against others. Track your progress and climb the leaderboards.
        </p>
      </div>

      {/* Contest cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {contests.map((contest) => (
          <Link 
            href={`/contest/${contest.type}`} 
            key={contest.type}
            className="group h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-4 focus-visible:ring-opacity-60 focus-visible:ring-blue-500 rounded-2xl transition-all duration-300 hover:-translate-y-2"
          >
            <div className={`
              h-full rounded-2xl overflow-hidden relative
              border ${contest.light.borderColor} ${contest.dark.borderColor}
              bg-gradient-to-br ${contest.light.bgGradient} ${contest.dark.bgGradient}
              shadow-lg hover:shadow-xl dark:shadow-none dark:hover:shadow-none
              transition-all duration-300
            `}>
              <div className="p-1">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <span className={`
                      flex items-center justify-center p-3 rounded-lg mr-4
                      ${contest.light.iconBg} ${contest.dark.iconBg}
                      ${contest.light.iconColor} ${contest.dark.iconColor}
                    `}>
                      {contest.icon}
                    </span>
                    <h2 className={`text-2xl font-bold ${contest.light.textColor} ${contest.dark.textColor}`}>
                      {contest.title}
                    </h2>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 mb-6">
                    {contest.description}
                  </p>
                  <div className={`flex items-center ${contest.light.textColor} ${contest.dark.textColor} font-medium`}>
                    <span>Start now</span>
                    <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
                
                {/* Decorative elements - different for light/dark */}
                <div className="absolute top-0 right-0 w-32 h-32 -mr-10 -mt-10 rounded-full bg-white/20 dark:bg-gray-700/20"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 -ml-8 -mb-8 rounded-full bg-white/20 dark:bg-gray-700/20"></div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Footer note */}
      <div className="mt-16 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>Leaderboards reset at the end of each contest period</p>
      </div>
    </div>
  );
}