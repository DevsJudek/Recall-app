// src/pages/PracticeSetup.jsx
import { useState } from 'react';

export default function PracticeSetup({ startPractice, courses, setCurrentView }) {
    const [normalSelection, setNormalSelection] = useState('mixed');

    const handleRanked = () => {
        startPractice('mixed', 'ranked');
    };

    const handleNormal = () => {
        if (normalSelection === 'mixed') {
            startPractice('mixed', 'normal');
        } else {
            const selectedCourse = courses.find(c => c.code === normalSelection);
            startPractice(selectedCourse, 'normal');
        }
    };

    return (
        <div className="bg-[#F8F9FA] dark:bg-[#0a0a0a] flex flex-col font-sans min-h-full">
            <div className="flex-1 flex flex-col items-center p-4 md:p-6 max-w-6xl mx-auto w-full pt-6 md:pt-8">

                {/* 🚀 Standardized Header (Matches Dashboard) */}
                <div className="flex flex-row items-center justify-between w-full mb-6 gap-4">
                    <div className="flex flex-col items-start text-left">
                    <h1 className="text-2xl md:text-4xl font-black tracking-tight text-[#1A1A1A] dark:text-white mb-1">
                        Practice & Tests
                    </h1>
                    <p className="text-xs md:text-sm font-medium text-gray-500 mt-1">
                        Select how you want to practice your questions today.
                    </p>
                    </div>
                    <button type="button" onClick={(e) => { e.preventDefault(); setCurrentView('test_history'); }} className="px-4 py-2 bg-white dark:bg-[#242424] text-[#1A1A1A] dark:text-white border border-[#E5E5E5] dark:border-gray-700 rounded-[14px] text-sm font-bold flex items-center gap-1.5 hover:border-[#FF6B00] dark:hover:border-[#FF6B00] hover:text-[#FF6B00] dark:hover:text-[#FF6B00] shadow-sm transition-all whitespace-nowrap shrink-0"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>History</button>
                </div>

                {/* CARDS CONTAINER */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full pb-8">

                    {/* RANKED MODE CARD */}
                    <div className="bg-[#FFD5C2] dark:bg-orange-950 p-1.5 rounded-[32px] shadow-inner relative flex flex-col">
                        <div className="absolute top-0 right-6 transform -translate-y-1/2 bg-[#FF6B00] text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-md z-10">
                            Recommended
                        </div>
                        <div className="bg-white dark:bg-[#121212] rounded-[24px] px-6 py-6 flex-1 flex flex-col items-center text-center shadow-sm border border-orange-50 dark:border-orange-900/30 hover:border-[#FFD5C2] dark:hover:border-[#FF6B00] transition-colors relative overflow-hidden">
                            <h2 className="text-2xl font-black text-[#1A1A1A] dark:text-white mb-2">Ranked Mode</h2>
                            <p className="text-sm text-[#666666] dark:text-gray-400 font-medium leading-snug mb-3">Test your speed and accuracy to climb the leaderboard.</p>
                            <div className="px-3 py-1 bg-[#FFF9F5] dark:bg-orange-950/30 text-[#FF6B00] text-[10px] font-extrabold uppercase tracking-wider rounded-lg mb-5">Includes 15s timer</div>

                            <div className="flex flex-col items-center gap-1.5 text-xs font-bold text-gray-400 dark:text-gray-500 mb-5 mt-auto w-full">
                                <span className="flex items-center gap-1.5">❓ 15 Questions</span>
                                <span className="flex items-center gap-1.5 text-[#FF6B00]">🏆 +XP Bonus</span>
                            </div>

                            <div className="w-full bg-[#F8F9FA] dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-gray-800 rounded-xl px-4 py-3 mb-4 text-left">
                                <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Course Selection</label>
                                <div className="text-sm font-black text-gray-600 dark:text-gray-300 flex justify-between items-center">
                                    <span>Mixed Curriculum</span>
                                    <span className="text-[#FF6B00] text-xs">🔒</span>
                                </div>
                            </div>

                            <button onClick={handleRanked} className="w-full py-3 bg-[#FF6B00] text-white rounded-[14px] font-bold text-sm shadow-md shadow-[#FF6B00]/20 hover:bg-[#E05D00] transition-colors flex items-center justify-center gap-2 active:scale-95">
                                Start Ranked Test →
                            </button>
                        </div>
                    </div>

                    {/* NORMAL MODE CARD */}
                    <div className="bg-blue-100 dark:bg-blue-950 p-1.5 rounded-[32px] shadow-inner flex flex-col">
                        <div className="bg-white dark:bg-[#121212] rounded-[24px] px-6 py-6 flex-1 flex flex-col items-center text-center shadow-sm border border-gray-100 dark:border-blue-900/30 hover:border-blue-100 dark:hover:border-blue-600 transition-colors">
                            <h2 className="text-2xl font-black text-[#1A1A1A] dark:text-white mb-2">Normal Mode</h2>
                            <p className="text-sm text-[#666666] dark:text-gray-400 font-medium leading-snug mb-3">Perfect for learning. Take your time to read each question.</p>
                            <div className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-[10px] font-extrabold uppercase tracking-wider rounded-lg mb-5">No timer included</div>

                            <div className="flex flex-col items-center gap-1.5 text-xs font-bold text-gray-400 dark:text-gray-500 mb-5 mt-auto w-full">
                                <span className="flex items-center gap-1.5">❓ 30 Questions</span>
                                <span className="flex items-center gap-1.5">⭐ Learn mode</span>
                            </div>

                            <div className="w-full bg-blue-50/50 dark:bg-[#1A1A1A] border border-blue-100 dark:border-gray-800 rounded-xl px-4 py-3 mb-4 text-left relative focus-within:border-blue-400 dark:focus-within:border-blue-600 transition-colors">
                                <label className="block text-[9px] font-black text-blue-400 dark:text-blue-500 uppercase tracking-widest mb-1">Course Selection</label>
                                <select
                                    value={normalSelection}
                                    onChange={(e) => setNormalSelection(e.target.value)}
                                    className="w-full appearance-none bg-transparent text-sm font-black text-[#1A1A1A] dark:text-white outline-none cursor-pointer pr-6"
                                >
                                    <option value="mixed">Mixed Curriculum</option>
                                    {courses && courses.map(course => (
                                        <option key={course.code} value={course.code}>
                                            {course.code} - {course.title}
                                        </option>
                                    ))}
                                </select>
                                <div className="pointer-events-none absolute bottom-3.5 right-4 flex items-center text-blue-500">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"></path></svg>
                                </div>
                            </div>

                            <button onClick={handleNormal} className="w-full py-3 bg-[#111827] dark:bg-white text-white dark:text-[#111827] rounded-[14px] font-bold text-sm shadow-md hover:bg-black dark:hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 active:scale-95">
                                Start Normal Test →
                            </button>
                        </div>
                    </div>

                    {/* CUSTOM ROOM CARD */}
                    <div className="bg-gray-300 dark:bg-gray-800 p-1.5 rounded-[32px] shadow-inner flex flex-col opacity-75">
                        <div className="bg-white dark:bg-[#121212] rounded-[24px] px-6 py-6 flex-1 flex flex-col items-center text-center shadow-sm border border-gray-100 dark:border-gray-800 relative overflow-hidden">
                            <h2 className="text-2xl font-black text-[#1A1A1A] dark:text-white mb-2">Custom Room</h2>
                            <p className="text-sm text-[#666666] dark:text-gray-400 font-medium leading-snug mb-3">Challenge up to 4 classmates simultaneously in a private live arena.</p>
                            <div className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-[10px] font-extrabold uppercase tracking-wider rounded-lg mb-5">Multiplayer</div>

                            <div className="flex items-center justify-center w-full text-xs font-bold text-gray-400 dark:text-gray-500 mb-5 mt-auto">
                                <span className="flex items-center gap-1.5">👥 2-4 Players</span>
                            </div>

                            <button disabled className="w-full py-3 bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 rounded-[14px] font-bold text-sm border border-gray-200 dark:border-gray-700 cursor-not-allowed flex items-center justify-center gap-2 mt-auto">
                                Coming Soon 🔒
                            </button>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}


