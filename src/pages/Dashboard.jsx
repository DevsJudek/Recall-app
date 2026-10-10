// src/pages/Dashboard.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../supabase'; // 🚀 IMPORTED SUPABASE

// We place this OUTSIDE the component so it catches the event 
// the exact millisecond the page loads, before React even finishes rendering!
let globalDeferredPrompt = null;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  globalDeferredPrompt = e;
});

export default function Dashboard({
  firstName, streakCount, dailyTarget, dailyProgress, level, department, openLeaderboard,
  setCurrentView, startPractice, courses, openCourseTopics, practiceMode, setPracticeMode, topStudents, canClaimStreak, getCourseMastery,
  isSupported, session, isPushEnabled, togglePush, onlineUsersCount,
  needRefresh, updateServiceWorker, isUpdating
}) {

  const safeDailyTarget = dailyTarget > 0 ? dailyTarget : 30;
  const safeProgress = dailyProgress || 0;
  const progressPercent = Math.min((safeProgress / safeDailyTarget), 1);

  const calculatedStreakPercent = Math.round((Math.min(streakCount || 0, 30) / 30) * 100);
  const [streakAnimPercent, setStreakAnimPercent] = useState(0);

  const [isAppInstalled, setIsAppInstalled] = useState(() => {
    return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
  });
  const [waitlistStatus, setWaitlistStatus] = useState('idle');

  useEffect(() => {
    const timer = setTimeout(() => setStreakAnimPercent(calculatedStreakPercent), 300);

    const handleAppInstalled = () => {
      setIsAppInstalled(true);
      globalDeferredPrompt = null;
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [calculatedStreakPercent]);

  const handleInstallClick = async () => {
    if (globalDeferredPrompt) {
      // Show the native Android install prompt!
      globalDeferredPrompt.prompt();
      const { outcome } = await globalDeferredPrompt.userChoice;
      if (outcome === 'accepted') setIsAppInstalled(true);
      globalDeferredPrompt = null;
    } else {
      // iOS / Strict Browsers custom alert
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
      if (isIOS) {
        alert("To install the app on iOS, tap the 'Share' icon (the square with an arrow pointing up) at the bottom of your browser and select 'Add to Home Screen'.");
      } else {
        alert("To install the app, tap the '3 dots' menu in your browser and select 'Install app' or 'Add to Home Screen'.");
      }
    }
  };

  // 🚀 NEW: HANDLE WAITLIST SUBMISSION
  const handleJoinWaitlist = async () => {
    if (!session?.user?.email) return;

    setWaitlistStatus('loading');

    // Upsert so if they change department and click again, it updates their record instead of crashing
    await supabase.from('waitlist').upsert([
      {
        email: session.user.email,
        department: department,
        level: level
      }
    ], { onConflict: 'email' });

    // Show success!
    setWaitlistStatus('success');
  };

  // PERFECT SUN-SAT CALENDAR LOGIC
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const currentDay = today.getDay();
  const streakEndDate = new Date(today);
  if (canClaimStreak) {
    streakEndDate.setDate(streakEndDate.getDate() - 1);
  }

  const renderCalendar = Array(7).fill({}).map((_, i) => {
    const dayDate = new Date(today);
    dayDate.setDate(today.getDate() - currentDay + i);
    const isToday = i === currentDay;
    const isFuture = dayDate > today;
    const daysFromEnd = Math.floor((streakEndDate - dayDate) / (1000 * 60 * 60 * 24));
    const isChecked = daysFromEnd >= 0 && daysFromEnd < (streakCount || 0);

    return {
      dayName: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][i],
      date: dayDate.getDate().toString(),
      isToday, isFuture, isChecked
    };
  });

  const fallbackCourse = {
    id: 'default-course', code: 'BUL 301', title: 'Commercial Law',
    topics_count: 4, last_studied: 'Just now', units: 4, is_available: true
  };

  const continueCourse = courses && courses.length > 0
    ? (courses.find(c => c.title.toLowerCase().includes('commercial')) || courses[0])
    : fallbackCourse;

  const courseMastery = getCourseMastery(continueCourse.code, continueCourse.topics_count || 4);
  const [selectedTopic, setSelectedTopic] = useState('mixed');

  useEffect(() => {
    if (practiceMode === 'ranked') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedTopic('mixed');
    }
  }, [practiceMode]);

  const displayStudents = topStudents && topStudents.length > 0 ? topStudents.slice(0, 3) : [];

  return (
    <div className="max-w-7xl mx-auto space-y-6 md:space-y-8 animate-fade-in pb-16">

      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-4xl font-black tracking-tight text-[#1A1A1A] dark:text-white mb-1">
          Welcome back, {firstName || 'Student'}! 👋
        </h1>
        <p className="text-xs md:text-sm font-medium text-gray-500 dark:text-gray-400">Ready to ace your exams today?</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">

        {/* LEFT COLUMN */}
        <div className="lg:col-span-8 flex flex-col gap-4 md:gap-6">
        


          {/* STUDY STREAK BLOCK (Always visible) */}
          <div className="bg-white dark:bg-[#121212] border border-[#E5E5E5] dark:border-gray-800 rounded-[24px] md:rounded-[32px] p-5 md:p-8 shadow-sm overflow-hidden">
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-gray-500 dark:text-gray-400 font-bold text-[11px] md:text-sm block">Study Streak</span>
                <span className="text-[#FF6B00] font-black text-[11px] md:text-sm">{streakCount || 0}d</span>
              </div>
              <h2 className="text-lg md:text-3xl font-black text-[#1A1A1A] dark:text-white">Activity Over 30 Days</h2>
            </div>
            <div className="flex flex-row items-end justify-between w-full mt-2">
              <div className="flex gap-1.5 sm:gap-2 md:gap-4 flex-1 justify-start">
                {renderCalendar.map((day, i) => (
                  <div key={i} className="flex flex-col items-center gap-1 sm:gap-2">
                    <span className="text-[9px] sm:text-[11px] md:text-xs font-medium text-gray-400 dark:text-gray-500">{day.dayName}</span>
                    {day.isFuture ? (
                      <div className="flex flex-col items-center justify-center w-7 h-[36px] sm:w-8 sm:h-[42px] md:w-10 md:h-[52px] rounded-full bg-[#F8F9FA] dark:bg-gray-800/50">
                        <span className="text-[11px] md:text-sm font-bold text-gray-400 dark:text-gray-600">{day.date}</span>
                      </div>
                    ) : day.isToday && !day.isChecked ? (
                      <div className="flex flex-col items-center justify-center w-7 h-[36px] sm:w-8 sm:h-[42px] md:w-10 md:h-[52px] rounded-full bg-[#FF6B00] shadow-sm">
                        <span className="text-[11px] md:text-sm font-bold text-white">{day.date}</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-between h-[36px] sm:h-[42px] md:h-[52px] pb-1">
                        <span className="text-[11px] md:text-sm font-bold text-[#1A1A1A] dark:text-white mt-0.5 md:mt-1">{day.date}</span>
                        {day.isChecked ? (
                          <div className="w-3.5 h-3.5 md:w-4 md:h-4 rounded-full bg-[#FF6B00] flex items-center justify-center shadow-sm">
                            <svg className="w-2.5 h-2.5 md:w-3 md:h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                          </div>
                        ) : <div className="w-3.5 h-3.5 md:w-4 md:h-4"></div>}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="relative w-24 sm:w-28 md:w-48 flex-shrink-0 mb-3 md:mb-5">
                <svg className="w-full overflow-visible" viewBox="0 0 100 50">
                  <defs>
                    <pattern id="stripes" patternUnits="userSpaceOnUse" width="3" height="3" patternTransform="rotate(45)"><line x1="0" y="0" x2="0" y2="3" className="stroke-[#E5E5E5] dark:stroke-gray-800" strokeWidth="1" /></pattern>
                  </defs>
                  <path d="M 15 45 A 35 35 0 0 1 85 45" fill="none" stroke="url(#stripes)" strokeWidth="12" strokeLinecap="butt" />
                  <path d="M 15 45 A 35 35 0 0 1 85 45" fill="none" stroke="#FF6B00" strokeWidth="12" strokeLinecap="butt" strokeDasharray="110" strokeDashoffset={110 - (streakAnimPercent / 100) * 110} className="transition-all duration-1000 ease-out" />
                </svg>
                <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center justify-end transform translate-y-3 md:translate-y-5">
                  <div className="flex items-baseline gap-0.5">
                    <span className="text-xl sm:text-2xl md:text-4xl font-black text-[#1A1A1A] dark:text-white leading-none">{streakAnimPercent}</span>
                    <span className="text-[9px] md:text-sm font-bold text-gray-400">%</span>
                  </div>
                  <span className="text-[8px] md:text-[10px] font-medium text-gray-400 mt-0.5">Progress</span>
                </div>
              </div>
            </div>
          </div>

          {/* UPDATE AVAILABLE BANNER */}
          {needRefresh && (
            <div className="bg-[#FFF2EC] dark:bg-orange-950/20 border border-[#FFD5C2] dark:border-orange-900/50 rounded-2xl p-4 flex items-center justify-between gap-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#FF6B00]/10 dark:bg-[#FF6B00]/20 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-[#FF6B00]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#1A1A1A] dark:text-white">Update Available</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">A new version of Recall is ready.</p>
                </div>
              </div>
              <button
                onClick={updateServiceWorker}
                disabled={isUpdating}
                className="px-5 py-2.5 bg-[#FF6B00] hover:bg-[#E05D00] text-white text-xs font-bold rounded-[14px] transition-all shadow-sm shrink-0 flex items-center gap-2 cursor-pointer disabled:opacity-75"
              >
                {isUpdating ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Updating...</span>
                  </>
                ) : (
                  <span>Update</span>
                )}
              </button>
            </div>
          )}

          {/* 🚀 UNSUPPORTED DEPARTMENT VIEW */}
          {!isSupported ? (
            <div className="bg-white dark:bg-[#121212] border border-[#E5E5E5] dark:border-gray-800 rounded-[24px] md:rounded-[32px] p-8 md:p-12 text-center shadow-sm">
              <div className="text-5xl mb-4">🚧</div>
              <h2 className="text-2xl md:text-3xl font-black text-[#1A1A1A] dark:text-white mb-3">Not available yet</h2>
              <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 font-medium max-w-sm mx-auto leading-relaxed mb-8">
                Recall's curriculum is currently strictly tailored for <span className="font-bold text-[#1A1A1A] dark:text-white">Law</span> students. We are working hard to bring {department} materials to you soon!
              </p>

              {/* 🚀 FULLY FUNCTIONAL WAITLIST BUTTON */}
              <button
                onClick={handleJoinWaitlist}
                disabled={waitlistStatus === 'loading' || waitlistStatus === 'success'}
                className="bg-[#1A1A1A] dark:bg-white hover:bg-black dark:hover:bg-gray-200 text-white dark:text-[#1A1A1A] px-8 py-4 rounded-[16px] font-bold text-sm shadow-md transition-all active:scale-[0.98] disabled:opacity-80 flex items-center justify-center gap-2 mx-auto"
              >
                {waitlistStatus === 'idle' && 'Notify me when available'}

                {waitlistStatus === 'loading' && (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white dark:text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Joining Waitlist...
                  </>
                )}

                {waitlistStatus === 'success' && '✓ You\'re on the list!'}
              </button>
            </div>
          ) : (
            /* REGULAR DASHBOARD COMPONENTS FOR SUPPORTED USERS */
            <>
              {!isAppInstalled && (
                <div className="bg-[#F8F9FA] dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-gray-800 rounded-[24px] md:rounded-[32px] p-6 md:p-8 flex flex-col gap-4 shadow-sm relative overflow-hidden group">
                  <div className="flex justify-between items-start w-full">
                    <img src="/app-icon.png" alt="Recall Icon" className="w-14 h-14 md:w-16 md:h-16 rounded-[14px] object-cover shadow-sm transition-transform group-hover:scale-105" />
                    <button onClick={handleInstallClick} className="bg-[#FF6B00] hover:bg-[#E05D00] text-white px-5 py-2.5 md:px-6 rounded-[14px] md:rounded-[14px] font-bold text-sm transition-all shadow-sm active:scale-95">Install</button>
                  </div>
                  <div className="mt-1">
                    <h3 className="text-xl md:text-2xl font-black text-[#1A1A1A] dark:text-white mb-1">Install the Recall App</h3>
                    <p className="text-sm md:text-base font-medium text-gray-500 dark:text-gray-400">Install for easy access & reminders</p>
                  </div>
                </div>
              )}

              <div className="bg-white dark:bg-[#121212] border border-[#E5E5E5] dark:border-gray-800 rounded-[24px] md:rounded-[32px] p-6 md:p-8 shadow-sm">
                <h2 className="text-xl md:text-2xl font-black text-[#1A1A1A] dark:text-white mb-4">Ready to test your recall?</h2>
                <div className="flex bg-[#F8F9FA] dark:bg-[#1A1A1A] p-1 rounded-full relative w-full md:w-[60%] scale-95 md:scale-100 origin-left mb-6 border border-gray-200 dark:border-gray-800">
                  <div className="absolute top-1 bottom-1 w-[49%] bg-white dark:bg-[#333333] rounded-full shadow-sm transition-transform duration-300 ease-out" style={{ transform: practiceMode === 'normal' ? 'translateX(100%)' : 'translateX(0)' }}></div>
                  <button onClick={() => setPracticeMode('ranked')} className={`flex-1 relative z-10 py-2.5 text-xs md:text-sm font-black tracking-wide rounded-full transition-colors ${practiceMode === 'ranked' ? 'text-[#1A1A1A] dark:text-white' : 'text-gray-400 dark:text-gray-500'}`}>Ranked</button>
                  <button onClick={() => setPracticeMode('normal')} className={`flex-1 relative z-10 py-2.5 text-xs md:text-sm font-black tracking-wide rounded-full transition-colors ${practiceMode === 'normal' ? 'text-[#1A1A1A] dark:text-white' : 'text-gray-400 dark:text-gray-500'}`}>Normal</button>
                </div>
                <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
                  <button onClick={() => setSelectedTopic('mixed')} className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-black tracking-widest uppercase rounded-full border transition-all ${selectedTopic === 'mixed' ? 'bg-[#FFF2EC] dark:bg-orange-950/30 text-[#FF6B00] border-[#FFD5C2] dark:border-orange-900/50' : 'bg-[#F8F9FA] dark:bg-[#1A1A1A] text-[#1A1A1A] dark:text-white border-[#E5E5E5] dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5" /></svg>
                    Mixed
                  </button>
                  {practiceMode !== 'ranked' && courses && courses.map((course) => (
                    <button key={course.code} onClick={() => setSelectedTopic(course)} className={`flex-shrink-0 px-3 py-1.5 text-[10px] font-black tracking-widest uppercase rounded-full border transition-all ${selectedTopic?.code === course.code ? 'bg-[#FFF2EC] dark:bg-orange-950/30 text-[#FF6B00] border-[#FFD5C2] dark:border-orange-900/50' : 'bg-[#F8F9FA] dark:bg-[#1A1A1A] text-[#1A1A1A] dark:text-white border-[#E5E5E5] dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
                      {course.code} - {course.title}
                    </button>
                  ))}
                </div>
                <button onClick={() => startPractice(selectedTopic, practiceMode)} className="w-full bg-[#FF6B00] text-white py-3 rounded-[14px] text-sm font-black tracking-wide hover:bg-[#E05D00] hover:shadow-lg hover:-translate-y-0.5 transition-all">
                  Start {practiceMode === 'ranked' ? 'ranked test' : 'normal test'} →
                </button>
              </div>

              <div className="bg-white dark:bg-[#121212] border border-[#E5E5E5] dark:border-gray-800 rounded-[24px] md:rounded-[32px] p-6 md:p-8 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl md:text-2xl font-black text-[#1A1A1A] dark:text-white">Continue Studying</h2>
                  <button onClick={() => setCurrentView('courses')} className="text-xs font-bold text-[#FF6B00] hover:text-[#E05D00] transition-colors">View All →</button>
                </div>
                <div className="w-full md:w-2/3 lg:w-1/2">
                    <div className="bg-white dark:bg-[#1A1A1A] rounded-[28px] p-5 md:p-6 border border-[#E5E5E5] dark:border-gray-800 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:border-[#FFD5C2] dark:hover:border-[#FF6B00] transition-all flex flex-col group cursor-pointer" onClick={() => { if (continueCourse.is_available !== false) openCourseTopics(continueCourse); }}>
                        <div className="flex justify-between items-center mb-5">
                            <span className={`px-3 py-1 rounded-[8px] text-[10px] font-black uppercase tracking-widest border ${continueCourse.type === 'Apex' ? 'bg-[#FFF5F0] dark:bg-[#FF6B00]/10 text-[#FF6B00] border-[#FFD5C2] dark:border-[#FF6B00]/20' : 'bg-[#F8F9FA] dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-gray-100 dark:border-gray-700'}`}>
                                {continueCourse.code}
                            </span>
                            <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">{continueCourse.units || 4} UNITS</span>
                        </div>
                        <h3 className="text-xl font-black text-[#1A1A1A] dark:text-white mb-4 leading-snug">{continueCourse.title}</h3>
                        <div className="flex items-center gap-5 text-xs font-bold text-gray-500 dark:text-gray-400 mb-5">
                            <span className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-[#FF6B00]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 8l8-4 8 4-8-4zm0 4l8 4 8-4m-16 4l8 4 8-4" /></svg>
                                {continueCourse.topics_count || 4} Topics
                            </span>
                        </div>
                        <div className="mb-6">
                            <div className="flex justify-between items-end mb-2">
                                <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">MASTERY</span>
                                <span className="text-xs font-black text-[#FF6B00]">{courseMastery}%</span>
                            </div>
                            <div className="w-full bg-[#F3F4F6] dark:bg-gray-800 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-[#FF6B00] h-full rounded-full transition-all duration-500" style={{ width: `${courseMastery}%` }}></div>
                            </div>
                        </div>
                        <div className="mt-auto pt-1">
                            <p className="text-[11px] text-gray-400 dark:text-gray-500 italic font-medium mb-3">
                                Last studied {continueCourse.last_studied || 'recently'}
                            </p>
                            <button type="button" onClick={(e) => { e.stopPropagation(); openCourseTopics(continueCourse); }} className="w-full py-3 text-sm font-bold rounded-[14px] transition-all flex items-center justify-center gap-2 bg-[#F8F9FA] dark:bg-gray-800 text-[#1A1A1A] dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600">
                                Resume course &rarr;
                            </button>
                        </div>
                    </div>
                  </div>
              </div>
            </>
          )}
        </div>

        {/* RIGHT COLUMN - ONLY VISIBLE IF SUPPORTED */}
        {isSupported && (
          <div className="lg:col-span-4 flex flex-col gap-4 md:gap-6">
            <div className="bg-white dark:bg-[#121212] border border-[#E5E5E5] dark:border-gray-800 rounded-[24px] md:rounded-[32px] py-4 px-6 md:py-6 md:px-8 shadow-sm flex flex-col items-center text-center">
              <h3 className="w-full text-left font-black text-[#1A1A1A] dark:text-white text-lg mb-6">Daily Goal</h3>
              <div className="relative w-40 h-40 md:w-48 md:h-48 mb-6">
                <svg className="w-full h-full transform -rotate-[225deg]" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" strokeWidth="8" fill="none" strokeLinecap="round" strokeDasharray="188.5 251.2" strokeDashoffset="-31.4" className="stroke-[#F3F4F6] dark:stroke-gray-800" />
                  <circle cx="50" cy="50" r="40" stroke="#FF6B00" strokeWidth="8" fill="none" strokeLinecap="round" strokeDasharray={`${progressPercent * 188.5} 251.2`} strokeDashoffset="-31.4" className="transition-all duration-1000 ease-out" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center pt-4">
                  <span className="text-3xl md:text-4xl font-black text-[#1A1A1A] dark:text-white">{safeProgress}<span className="text-xl md:text-2xl text-gray-400 dark:text-gray-600">/{safeDailyTarget}</span></span>
                  <span className="text-[10px] font-black tracking-widest text-gray-400 dark:text-gray-500 uppercase mt-1">Questions</span>
                </div>
              </div>
              <p className="text-xs md:text-sm font-medium text-gray-500 dark:text-gray-400">
                You're only <span className="text-[#FF6B00] font-bold">{Math.max(safeDailyTarget - safeProgress, 0)} questions</span> away from your target!
              </p>
            </div>

            <div className="bg-[#F8F9FA] dark:bg-[#1A1A1A] rounded-[24px] md:rounded-[32px] p-6 shadow-sm flex-1 flex flex-col border border-gray-100 dark:border-gray-800">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-black text-[#1A1A1A] dark:text-white">{level || '300L'} {department} Top 3</h2>
                <button onClick={openLeaderboard} className="text-2xl hover:scale-110 transition-transform">🏆</button>
              </div>
              <div className="flex flex-col mb-4">
                {displayStudents.map((student, index) => (
                  <div key={student.id} className="bg-white dark:bg-[#242424] rounded-[20px] p-4 mb-3 flex items-center justify-between shadow-sm border border-transparent dark:border-gray-800">
                    <div className="flex items-center gap-4">
                      <span className={`text-lg md:text-xl font-black italic w-6 ${index === 0 ? 'text-[#FF6B00]' : 'text-gray-400 dark:text-gray-500'}`}>#{index + 1}</span>
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center shrink-0">
                        {student.avatar && student.avatar.startsWith('http') ? <img src={student.avatar} alt={student.name} className="w-full h-full object-cover" /> : <span className="text-sm font-black text-white">{student.name.charAt(0).toUpperCase()}</span>}
                      </div>
                      <div>
                        <p className="font-bold text-[#1A1A1A] dark:text-white text-sm md:text-base leading-snug">{student.name}</p>
                        <p className="text-xs font-bold text-gray-500 dark:text-gray-400">{student.points} XP</p>
                      </div>
                    </div>
                    {index === 0 && <span className="text-2xl">👑</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
