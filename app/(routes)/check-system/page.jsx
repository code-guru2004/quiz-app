"use client";
import { useEffect, useState } from "react";

export default function SystemCheck() {
  const [browserCompatible, setBrowserCompatible] = useState(true);
  const [browserInfo, setBrowserInfo] = useState({});
  const [isChecking, setIsChecking] = useState(true);

  const [system, setSystem] = useState({
    online: true,
    browser: "Unknown",
    compatibleBrowser: false,
    features: {
      webRTC: false,
      localStorage: false,
      serviceWorker: false,
      geolocation: false,
      notifications: false,
    },
    screen: {
      width: 0,
      height: 0,
      isMobile: false,
      isTablet: false,
      isDesktop: false,
    },
    performance: {
      deviceMemory: "Unknown",
      connection: "Unknown",
    },
  });

  const checkBrowserCompatibility = () => {
    const userAgent = navigator.userAgent;
    let browserName = 'Unknown';
    let browserVersion = 'Unknown';
    let compatible = true;
    let issues = [];

    // Detect browser and version
    if (userAgent.indexOf('Firefox') > -1) {
      browserName = 'Firefox';
      browserVersion = userAgent.match(/Firefox\/([0-9]+)/)?.[1] || 'Unknown';
      if (parseInt(browserVersion) < 78) {
        compatible = false;
        issues.push('Your Firefox version is outdated. Please update to version 78 or later.');
      }
    } else if (userAgent.indexOf('Edg') > -1) {
      browserName = 'Edge';
      browserVersion = userAgent.match(/Edg\/([0-9]+)/)?.[1] || 'Unknown';
    } else if (userAgent.indexOf('Chrome') > -1) {
      browserName = 'Chrome';
      browserVersion = userAgent.match(/Chrome\/([0-9]+)/)?.[1] || 'Unknown';
      if (parseInt(browserVersion) < 80) {
        compatible = false;
        issues.push('Your Chrome version is outdated. Please update to version 80 or later.');
      }
    } else if (userAgent.indexOf('Safari') > -1) {
      browserName = 'Safari';
      browserVersion = userAgent.match(/Version\/([0-9]+)/)?.[1] || 'Unknown';
      if (parseInt(browserVersion) < 13) {
        compatible = false;
        issues.push('Your Safari version is outdated. Please update to version 13 or later.');
      }
    } else {
      issues.push('We recommend using Chrome, Firefox, Safari, or Edge for the best experience.');
    }

    // Check for specific features
    if (!('IntersectionObserver' in window)) {
      compatible = false;
      issues.push('Your browser does not support Intersection Observer API.');
    }

    if (!('Promise' in window)) {
      compatible = false;
      issues.push('Your browser does not support Promises.');
    }

    setBrowserInfo({ name: browserName, version: browserVersion, issues });
    setBrowserCompatible(compatible);
    return compatible;
  };

  useEffect(() => {
    // 1️⃣ Internet connectivity
    const updateOnlineStatus = () =>
      setSystem(prev => ({ ...prev, online: navigator.onLine }));
    
    setSystem(prev => ({ ...prev, online: navigator.onLine }));
    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);

    // 2️⃣ Browser detection
    const compatibleBrowser = checkBrowserCompatibility();
   
    // 3️⃣ Feature detection
    const features = {
      webRTC: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia),
      localStorage: typeof window.localStorage !== "undefined",
      serviceWorker: "serviceWorker" in navigator,
      geolocation: "geolocation" in navigator,
      notifications: "Notification" in window,
    };

    // 4️⃣ Screen size and device type
    const updateScreenInfo = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setSystem(prev => ({
        ...prev,
        screen: {
          width,
          height,
          isMobile: width < 768,
          isTablet: width >= 768 && width < 1024,
          isDesktop: width >= 1024,
        }
      }));
    };
    
    updateScreenInfo();
    window.addEventListener('resize', updateScreenInfo);

    // 5️⃣ Performance info
    const getPerformanceInfo = () => {
      let deviceMemory = "Unknown";
      let connection = "Unknown";
      
      if ('deviceMemory' in navigator) {
        deviceMemory = `${navigator.deviceMemory}GB`;
      }
      
      if ('connection' in navigator) {
        const conn = navigator.connection;
        connection = conn.effectiveType || "Unknown";
      }
      
      setSystem(prev => ({
        ...prev,
        performance: {
          deviceMemory,
          connection
        }
      }));
    };
    
    getPerformanceInfo();

    // Set all system info
    setSystem(prev => ({
      ...prev,
      browser: browserInfo.name,
      compatibleBrowser,
      features,
    }));

    setIsChecking(false);

    // Cleanup
    return () => {
      window.removeEventListener("online", updateOnlineStatus);
      window.removeEventListener("offline", updateOnlineStatus);
      window.removeEventListener('resize', updateScreenInfo);
    };
  }, []);

  if (isChecking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 dark:border-blue-400 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Checking your system configuration...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            System Configuration Check
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Verify your browser compatibility and system capabilities
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          {/* Status Header */}
          <div className={`p-4 ${system.online && browserCompatible ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'} flex items-center justify-between`}>
            <div className="flex items-center">
              <div className={`w-4 h-4 rounded-full mr-2 ${system.online && browserCompatible ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="font-medium dark:text-white">
                {system.online && browserCompatible ? 
                  'System is compatible and ready' : 
                  'System may have compatibility issues'}
              </span>
            </div>
            <button 
              onClick={() => window.location.reload()} 
              className="text-sm bg-white dark:bg-gray-700 px-3 py-1 rounded-md shadow-sm text-gray-800 dark:text-white"
            >
              Re-check
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Internet Status */}
            <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center">
                <div className={`p-2 rounded-lg mr-4 ${system.online ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'}`}>
                  {system.online ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 dark:text-white">Internet Connection</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {system.online ? 'Connected to the internet' : 'No internet connection'}
                  </p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${system.online ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'}`}>
                {system.online ? 'Online' : 'Offline'}
              </span>
            </div>

            {/* Browser Info */}
            <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center">
                <div className={`p-2 rounded-lg mr-4 ${browserCompatible ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400'}`}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 dark:text-white">Browser Compatibility</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {browserInfo.name} {browserInfo.version} {browserCompatible ? '(Compatible)' : '(Limited support)'}
                  </p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${browserCompatible ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'}`}>
                {browserCompatible ? 'Supported' : 'Check'}
              </span>
            </div>

            {/* Screen Info */}
            <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center">
                <div className="p-2 rounded-lg mr-4 bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 dark:text-white">Screen Resolution</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {system.screen.width} × {system.screen.height} pixels
                    {system.screen.isMobile && ' (Mobile)'}
                    {system.screen.isTablet && ' (Tablet)'}
                    {system.screen.isDesktop && ' (Desktop)'}
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                {system.screen.isMobile ? 'Mobile' : system.screen.isTablet ? 'Tablet' : 'Desktop'}
              </span>
            </div>

            {/* Performance Info */}
            <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center">
                <div className="p-2 rounded-lg mr-4 bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 dark:text-white">Performance</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Connection: {system.performance.connection} | Memory: {system.performance.deviceMemory}
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                Info
              </span>
            </div>

            {/* Feature Support */}
            <div>
              <h3 className="font-medium text-gray-800 dark:text-white mb-4">Feature Support</h3>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(system.features).map(([feature, supported]) => (
                  <div key={feature} className="flex items-center bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                    <span className={`mr-2 ${supported ? 'text-green-500' : 'text-red-500'}`}>
                      {supported ? '✅' : '❌'}
                    </span>
                    <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">
                      {feature.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="font-medium text-gray-800 dark:text-white mb-4">Recommendations</h3>
          <ul className="space-y-2">
            {!system.online && (
              <li className="flex items-start">
                <span className="text-red-500 mr-2">•</span>
                <span className="text-gray-700 dark:text-gray-300">Check your internet connection and try again.</span>
              </li>
            )}
            {!browserCompatible && (
              <li className="flex items-start">
                <span className="text-yellow-500 mr-2">•</span>
                <span className="text-gray-700 dark:text-gray-300">Consider using a modern browser like Chrome, Firefox, or Edge.</span>
              </li>
            )}
            {!system.features.webRTC && (
              <li className="flex items-start">
                <span className="text-yellow-500 mr-2">•</span>
                <span className="text-gray-700 dark:text-gray-300">WebRTC is not supported. Video/audio features may not work.</span>
              </li>
            )}
            {system.screen.isMobile && (
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span className="text-gray-700 dark:text-gray-300">You're using a mobile device. Some features may be limited.</span>
              </li>
            )}
            {(system.performance.connection === 'slow-2g' || system.performance.connection === '2g') && (
              <li className="flex items-start">
                <span className="text-yellow-500 mr-2">•</span>
                <span className="text-gray-700 dark:text-gray-300">Your connection seems slow. Content may load slower than usual.</span>
              </li>
            )}
            {(system.online && browserCompatible) && (
              <li className="flex items-start">
                <span className="text-green-500 mr-2">•</span>
                <span className="text-gray-700 dark:text-gray-300">Your system meets the recommended requirements.</span>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}