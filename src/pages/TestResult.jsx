// src/pages/TestResult.jsx

export default function TestResult({ activeCourse, score, questions, practiceMode, startPractice }) {

    // Dynamically set subtitle
    const subtitle = practiceMode === 'ranked' ? 'MIXED' : (activeCourse?.code || 'PRACTICE MODULE');

    // Dynamically set button text
    const buttonText = practiceMode === 'ranked' ? 'Take another ranked test' : 'Take another unranked test';

    return (
        <div className="max-w-2xl mx-auto flex flex-col items-center justify-center py-16 px-4 animate-fade-in text-center h-full min-h-[70vh]">
            <div className="w-24 h-24 bg-[#FFF2EC] dark:bg-orange-950/20 rounded-full flex items-center justify-center text-4xl mb-6 shadow-sm border border-[#FFD5C2] dark:border-orange-900/50">🎯</div>

            <h2 className="text-3xl font-black text-[#1A1A1A] dark:text-white mb-2 tracking-tight">Test Completed!</h2>

            <p className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-8 uppercase tracking-widest">{subtitle}</p>

            <div className="bg-white dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-gray-800 rounded-[32px] p-8 w-full shadow-sm mb-8 transition-colors">
                <div className="flex justify-around items-center">
                    <div className="text-center">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Score</p>
                        <p className="text-4xl font-black text-[#1A1A1A] dark:text-white">{score}<span className="text-xl text-gray-300 dark:text-gray-600">/{questions.length || 0}</span></p>
                    </div>
                    <div className="w-px h-16 bg-gray-100 dark:bg-gray-800"></div>
                    <div className="text-center">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">XP Earned</p>
                        <p className="text-4xl font-black text-[#FF6B00]">{practiceMode === 'ranked' ? `+${score}` : '0'}</p>
                    </div>
                </div>
                {practiceMode === 'normal' && (
                    <div className="mt-6 bg-[#F8F9FA] dark:bg-[#242424] border border-[#E5E5E5] dark:border-gray-800 p-3 rounded-xl transition-colors">
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-bold">XP is not awarded in Practice Mode. Play <span className="text-[#1A1A1A] dark:text-white">Ranked Blitz</span> to earn XP!</p>
                    </div>
                )}
            </div>

            {/* The button inverts nicely in dark mode (white background, dark text) */}
            <button
                onClick={() => startPractice(activeCourse, practiceMode)}
                className="w-full bg-[#1A1A1A] dark:bg-gray-200 text-white dark:text-[#1A1A1A] py-4 rounded-xl text-sm font-black tracking-wide uppercase hover:bg-black dark:hover:bg-white shadow-md transition-all"
            >
                {buttonText}
            </button>
        </div>
    );
}