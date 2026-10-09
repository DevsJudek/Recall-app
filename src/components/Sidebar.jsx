// src/components/Sidebar.jsx
import RecallLogo from './RecallLogo';

export default function Sidebar({ currentView, setCurrentView, openLeaderboard, canClaimStreak, isSupported }) {
    if (currentView === 'onboarding') return null;

    return (
        <aside className="w-64 bg-white dark:bg-[#121212] border-r border-[#E5E5E5] dark:border-gray-800 flex-col justify-between p-6 hidden md:flex sticky top-0 h-screen transition-colors">
            <div>
                <div className="flex items-center gap-3 mb-10 pl-2">
                    <RecallLogo className="w-9 h-9" />
                    <span className="text-xl font-extrabold tracking-tight text-[#1A1A1A] dark:text-white">Recall</span>
                </div>

                <nav className="flex flex-col gap-1">
                    <button onClick={() => setCurrentView('dashboard')} className={`flex items-center gap-3 px-4 py-3 rounded-[14px] text-sm font-bold transition-all ${currentView === 'dashboard' ? 'bg-[#FFF2EC] dark:bg-orange-950/30 text-[#FF6B00]' : 'text-[#666666] dark:text-gray-400 hover:bg-[#F8F9FA] dark:hover:bg-[#242424]'}`}>
                        <span className="text-lg">🏠</span> Home
                    </button>

                    {/* 🚀 ONLY SHOW THESE IF THE USER IS IN A SUPPORTED DEPARTMENT */}
                    {isSupported && (
                        <>
                            <button onClick={() => setCurrentView('courses')} className={`flex items-center gap-3 px-4 py-3 rounded-[14px] text-sm font-bold transition-all ${currentView === 'courses' || currentView === 'course_topics' || currentView === 'reading' ? 'bg-[#FFF2EC] dark:bg-orange-950/30 text-[#FF6B00]' : 'text-[#666666] dark:text-gray-400 hover:bg-[#F8F9FA] dark:hover:bg-[#242424]'}`}>
                                <span className="text-lg">📚</span> Courses
                            </button>

                            <button onClick={() => setCurrentView('practice_setup')} className={`flex items-center gap-3 px-4 py-3 rounded-[14px] text-sm font-bold transition-all ${currentView === 'practice_setup' || currentView === 'quiz' || currentView === 'results' ? 'bg-[#FFF2EC] dark:bg-orange-950/30 text-[#FF6B00]' : 'text-[#666666] dark:text-gray-400 hover:bg-[#F8F9FA] dark:hover:bg-[#242424]'}`}>
                                <span className="text-lg">⚡</span> Tests
                            </button>

                            <button onClick={openLeaderboard} className={`flex items-center gap-3 px-4 py-3 rounded-[14px] text-sm font-bold transition-all ${currentView === 'leaderboard' || currentView === 'peer_profile' ? 'bg-[#FFF2EC] dark:bg-orange-950/30 text-[#FF6B00]' : 'text-[#666666] dark:text-gray-400 hover:bg-[#F8F9FA] dark:hover:bg-[#242424]'}`}>
                                <span className="text-lg">🏆</span> Rank
                            </button>
                        </>
                    )}

                    <button onClick={() => setCurrentView('profile')} className={`flex items-center gap-3 px-4 py-3 rounded-[14px] text-sm font-bold transition-all ${currentView === 'profile' || currentView === 'edit_profile' ? 'bg-[#FFF2EC] dark:bg-orange-950/30 text-[#FF6B00]' : 'text-[#666666] dark:text-gray-400 hover:bg-[#F8F9FA] dark:hover:bg-[#242424]'}`}>
                        <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden border border-[#E5E5E5] dark:border-gray-600">
                            <img src="https://i.pravatar.cc/150?u=judek" alt="Avatar" className="w-full h-full object-cover" />
                        </div>
                        Profile
                        {canClaimStreak && (
                            <span className="ml-auto w-2 h-2 rounded-full bg-[#FF6B00] animate-pulse"></span>
                        )}
                    </button>
                </nav>
            </div>

            
        </aside>
    );
}