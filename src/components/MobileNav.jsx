// src/components/MobileNav.jsx
export default function MobileNav({ currentView, setCurrentView, openLeaderboard, isSupported }) {
    // Now it ONLY hides on onboarding and edit_profile. It will show on all test pages!
    if (currentView === 'onboarding' || currentView === 'edit_profile') return null;

    return (
        <nav className="w-full bg-white dark:bg-[#121212] flex justify-around items-center px-4 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] dark:shadow-[0_-4px_20px_rgba(0,0,0,0.4)] border-t border-transparent dark:border-gray-800 transition-colors">
            <button onClick={() => setCurrentView('dashboard')} className={`flex flex-col items-center gap-1 w-14 transition-colors ${currentView === 'dashboard' ? 'text-[#FF6B00]' : 'text-[#666666] dark:text-gray-500 hover:text-[#1A1A1A] dark:hover:text-gray-300'}`}>
                <span className="text-2xl mb-0.5">🏠</span>
                <span className="text-[10px] font-extrabold tracking-wide">Home</span>
            </button>

            {/* 🚀 ONLY SHOW THESE IF THE USER IS IN A SUPPORTED DEPARTMENT */}
            {isSupported && (
                <>
                    <button onClick={() => setCurrentView('courses')} className={`flex flex-col items-center gap-1 w-14 transition-colors ${currentView === 'courses' || currentView === 'course_topics' || currentView === 'reading' ? 'text-[#FF6B00]' : 'text-[#666666] dark:text-gray-500 hover:text-[#1A1A1A] dark:hover:text-gray-300'}`}>
                        <span className="text-2xl mb-0.5">📚</span>
                        <span className="text-[10px] font-extrabold tracking-wide">Courses</span>
                    </button>

                    <button onClick={() => setCurrentView('practice_setup')} className={`flex flex-col items-center gap-1 w-14 transition-colors ${currentView === 'practice_setup' || currentView === 'quiz' || currentView === 'results' ? 'text-[#FF6B00]' : 'text-[#666666] dark:text-gray-500 hover:text-[#1A1A1A] dark:hover:text-gray-300'}`}>
                        <span className="text-2xl mb-0.5">⚡</span>
                        <span className="text-[10px] font-extrabold tracking-wide">Tests</span>
                    </button>

                    <button onClick={openLeaderboard} className={`flex flex-col items-center gap-1 w-14 transition-colors ${currentView === 'leaderboard' || currentView === 'peer_profile' ? 'text-[#FF6B00]' : 'text-[#666666] dark:text-gray-500 hover:text-[#1A1A1A] dark:hover:text-gray-300'}`}>
                        <span className="text-2xl mb-0.5">🏆</span>
                        <span className="text-[10px] font-extrabold tracking-wide">Rank</span>
                    </button>
                </>
            )}

            <button onClick={() => setCurrentView('profile')} className={`flex flex-col items-center gap-1 w-14 transition-colors ${currentView === 'profile' ? 'text-[#FF6B00]' : 'text-[#666666] dark:text-gray-500 hover:text-[#1A1A1A] dark:hover:text-gray-300'}`}>
                <span className="text-2xl mb-0.5">👤</span>
                <span className="text-[10px] font-extrabold tracking-wide">Profile</span>
            </button>
        </nav>
    );
}