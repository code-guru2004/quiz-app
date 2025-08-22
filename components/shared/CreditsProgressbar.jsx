import useGlobalContextProvider from '@/app/_context/ContextApi';
import { useEffect, useState } from 'react';

const CreditProgressBar = ({ currentCredits, maxCredits = 5 }) => {
    const {credits} = useGlobalContextProvider();
  const [progress, setProgress] = useState(0);
  
  // Calculate percentage for progress bar
  const percentage = Math.min(100, Math.max(0, (credits / maxCredits) * 100));
  
  // Animate progress bar when values change
  useEffect(() => {
    const timer = setTimeout(() => setProgress(percentage), 100);
    return () => clearTimeout(timer);
  }, [percentage]);

  // Determine color based on credit level
  const getColor = (percent) => {
    if (percent > 75) return 'bg-gradient-to-r from-green-400 to-emerald-600';
    if (percent > 40) return 'bg-gradient-to-r from-amber-400 to-orange-500';
    if (percent > 20) return 'bg-gradient-to-r from-orange-500 to-amber-600';
    return 'bg-gradient-to-r from-red-500 to-rose-600';
  };

  return (
    <div className="w-full max-w-md mx-auto px-6  rounded-2xl mb-2">
      <div className="flex justify-between items-center mb-1">
        <h3 className="font-semibold text-xs dark:text-gray-300 text-gray-600">Your Credits</h3>
        <span className="text-xs font-medium dark:text-gray-300 text-gray-700">
          {credits} / {maxCredits}
        </span>
      </div>
      
      {/* Main progress bar */}
      <div className="h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
        <div 
          className={`h-full transition-all duration-700 ease-out ${getColor(percentage)}`}
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      
      {/* Credit status message */}
      <div className="mt-0.5 text-xs font-thin text-gray-500">
        {percentage > 75 ? <span className='text-green-500'>Plenty of credits remaining!</span>  : 
         percentage > 40 ?<span className='text-yellow-400'>Good amount of credits available.</span>  : 
         percentage > 20 ?<span className='text-red-400'>Credits running low.</span> : 
         <span className='text-red-400'>Very low credits. Consider purchasing more.</span>
        }
      </div>
      
      {/* Sparkle icon for visual appeal */}
      <div className="absolute top-5 right-5">
        <svg className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      </div>
    </div>
  );
};

export default CreditProgressBar;