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
                <div className="w-full flex flex-col items-center justify-center p-12 text-center bg-white dark:bg-[#121212] border border-[#E5E5E5] dark:border-gray-800 rounded-[32px] mt-4 shadow-sm">
                    <div className="w-24 h-24 bg-orange-100 dark:bg-orange-950/50 rounded-full flex items-center justify-center mb-6">
                        <svg className="w-12 h-12 text-[#FF6B00]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-black text-[#1A1A1A] dark:text-white mb-4 tracking-tight">Tests Under Maintenance</h2>
                    <p className="text-gray-500 dark:text-gray-400 font-medium max-w-lg mx-auto leading-relaxed text-base">
                        We are currently performing a massive database upgrade and re-importing the question banks. Practice tests will be back online shortly!
                    </p>
                </div>
            </div>
        </div>
    );
}