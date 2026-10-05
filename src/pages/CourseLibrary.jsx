// src/pages/CourseLibrary.jsx
import { useState } from 'react';
import ResourceLibrary from './ResourceLibrary';

export default function CourseLibrary({ courses, openCourseTopics, getCourseMastery, setCurrentView, department }) {
    const [activeTab, setActiveTab] = useState('Courses');

    const enrolledCount = courses ? courses.filter(c => c.is_available).length : 0;

    return (
        <div className="max-w-7xl mx-auto pb-16 font-sans">
                {/* 🖥️ DESKTOP HEADER */}
                <div className="hidden md:flex flex-col mb-10">
                    <div className="flex justify-between items-center mb-8">
                        <div className="relative flex bg-[#F8F9FA] dark:bg-[#1A1A1A] p-1 rounded-full border border-[#E5E5E5] dark:border-gray-800 w-[240px] transition-colors">
                            <div className="absolute top-1 bottom-1 w-[115px] bg-white dark:bg-gray-800 rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.08)] transition-transform duration-300 ease-out" style={{ transform: activeTab === 'Library' ? 'translateX(117px)' : 'translateX(0)' }}></div>
                            <button type="button" onClick={() => setActiveTab('Courses')} className={`flex-1 relative z-10 py-2.5 text-sm font-bold rounded-full transition-colors ${activeTab === 'Courses' ? 'text-[#FF6B00]' : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white'}`}>Courses</button>
                            <button type="button" onClick={() => setActiveTab('Library')} className={`flex-1 relative z-10 py-2.5 text-sm font-bold rounded-full transition-colors ${activeTab === 'Library' ? 'text-[#FF6B00]' : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white'}`}>Library</button>
                        </div>

                        <div className="flex items-center gap-4">
                            {activeTab === 'Courses' ? (
                                <>
                                    <div className="px-5 py-3 bg-[#FFF5F0] dark:bg-[#FF6B00]/10 text-[#FF6B00] rounded-full text-xs font-bold flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"></path></svg>
                                        {enrolledCount} Enrolled Courses
                                    </div>
                                    <button
                                        type="button"
                                        onClick={(e) => { e.preventDefault(); setCurrentView('manage_courses'); }}
                                        className="px-5 py-2.5 bg-[#FF6B00] text-white rounded-[14px] text-sm font-bold flex items-center gap-1.5 hover:bg-[#E05D00] shadow-[0_4px_14px_rgba(255,107,0,0.2)] active:scale-95 transition-all"
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
                                        Manage
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        type="button"
                                        onClick={(e) => { e.preventDefault(); setCurrentView('suggest_material'); }}
                                        className="px-5 py-2.5 bg-white dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-gray-800 text-[#1A1A1A] dark:text-white rounded-[14px] text-sm font-bold flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-800 shadow-sm active:scale-95 transition-all"
                                    >
                                        <svg className="w-4 h-4 text-[#FF6B00]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"></path></svg>
                                        Suggest Material
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    <div>
                        <h1 className="text-[40px] font-black text-[#1A1A1A] dark:text-white tracking-tight mb-2">
                            {activeTab === 'Library' ? `${department ? department + ' Library' : 'Resource Library'}` : 'Your courses'}
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 font-medium text-[15px] max-w-2xl leading-relaxed">
                            {activeTab === 'Library' ? 'Access curated textbooks, past questions, and essential materials for your department.' : 'Master your syllabus topic by topic with curated resources, expert insights, and practice modules.'}
                        </p>
                    </div>
                </div>

                {/* 📱 MOBILE HEADER */}
                <div className="md:hidden flex flex-col mb-8 pt-2">
                    <div className="relative flex bg-[#F8F9FA] dark:bg-[#1A1A1A] p-1 rounded-full border border-[#E5E5E5] dark:border-gray-800 w-[220px] mb-8 transition-colors">
                        <div className="absolute top-1 bottom-1 w-[105px] bg-white dark:bg-gray-800 rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.08)] transition-transform duration-300 ease-out" style={{ transform: activeTab === 'Library' ? 'translateX(107px)' : 'translateX(0)' }}></div>
                        <button type="button" onClick={() => setActiveTab('Courses')} className={`flex-1 relative z-10 py-2.5 text-xs font-bold rounded-full transition-colors ${activeTab === 'Courses' ? 'text-[#FF6B00]' : 'text-gray-500 dark:text-gray-400'}`}>Courses</button>
                        <button type="button" onClick={() => setActiveTab('Library')} className={`flex-1 relative z-10 py-2.5 text-xs font-bold rounded-full transition-colors ${activeTab === 'Library' ? 'text-[#FF6B00]' : 'text-gray-500 dark:text-gray-400'}`}>Library</button>
                    </div>

                    <div className="flex justify-between items-center mb-3">
                        <h1 className="text-[32px] font-black text-[#1A1A1A] dark:text-white tracking-tight">
                            {activeTab === 'Library' ? `${department ? department + ' Library' : 'Resource Library'}` : 'Your courses'}
                        </h1>
                        {activeTab === 'Courses' && (
                            <button
                                type="button"
                                onClick={(e) => { e.preventDefault(); setCurrentView('manage_courses'); }}
                                className="px-4 py-2 bg-[#FF6B00] text-white rounded-[12px] text-[13px] font-bold flex items-center gap-1.5 hover:bg-[#E05D00] shadow-[0_4px_14px_rgba(255,107,0,0.2)] active:scale-95 transition-all"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
                                Manage
                            </button>
                        )}
                    </div>

                    <p className="text-gray-500 dark:text-gray-400 font-medium text-sm leading-relaxed mb-6">
                        {activeTab === 'Library' ? 'Access curated textbooks, past questions, and essential materials for your department.' : 'Master your syllabus topic by topic with curated resources, expert insights, and practice modules.'}
                    </p>
                </div>

                {/* 🚀 TAB CONTENT RENDERER */}
                {activeTab === 'Library' ? (
                    <ResourceLibrary onSuggestMaterial={() => setCurrentView('suggest_material')} />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 animate-fade-in">
                        {courses && courses.map((course) => {
                            const isAvailable = course.is_available;
                            const mastery = getCourseMastery ? getCourseMastery(course.code, course.topics_count) : 0;

                            return (
                                <div key={course.id} className="bg-white dark:bg-[#1A1A1A] rounded-[28px] p-5 md:p-6 border border-[#E5E5E5] dark:border-gray-800 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:border-[#FFD5C2] dark:hover:border-[#FF6B00] transition-all flex flex-col group">
                                    <div className="flex justify-between items-center mb-5">
                                        <span className={`px-3 py-1 rounded-[8px] text-[10px] font-black uppercase tracking-widest border ${course.type === 'Apex' ? 'bg-[#FFF5F0] dark:bg-[#FF6B00]/10 text-[#FF6B00] border-[#FFD5C2] dark:border-[#FF6B00]/20' : 'bg-[#F8F9FA] dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-gray-100 dark:border-gray-700'}`}>
                                            {course.code}
                                        </span>
                                        <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">{course.units || 4} UNITS</span>
                                    </div>
                                    <h3 className="text-xl font-black text-[#1A1A1A] dark:text-white mb-4 leading-snug">{course.title}</h3>
                                    <div className="flex items-center gap-5 text-xs font-bold text-gray-500 dark:text-gray-400 mb-5">
                                        <span className="flex items-center gap-2">
                                            <svg className="w-4 h-4 text-[#FF6B00]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 8l8-4 8 4-8-4zm0 4l8 4 8-4m-16 4l8 4 8-4" /></svg>
                                            {course.topics_count} Topics
                                        </span>
                                    </div>
                                    {isAvailable && (
                                        <div className="mb-6">
                                            <div className="flex justify-between items-end mb-2">
                                                <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">MASTERY</span>
                                                <span className="text-xs font-black text-[#FF6B00]">{mastery}%</span>
                                            </div>
                                            <div className="w-full bg-[#F3F4F6] dark:bg-gray-800 h-1.5 rounded-full overflow-hidden">
                                                <div className="bg-[#FF6B00] h-full rounded-full transition-all duration-500" style={{ width: `${mastery}%` }}></div>
                                            </div>
                                        </div>
                                    )}
                                    <div className="mt-auto pt-1">
                                        <p className="text-[11px] text-gray-400 dark:text-gray-500 italic font-medium mb-3">
                                            {isAvailable ? `Last studied ${course.last_studied || 'recently'}` : 'Join students waiting for this'}
                                        </p>
                                        <button type="button" onClick={(e) => { e.preventDefault(); isAvailable && openCourseTopics(course); }} disabled={!isAvailable} className={`w-full py-3.5 text-sm font-bold rounded-[14px] transition-all flex items-center justify-center gap-2 ${isAvailable ? 'bg-[#F8F9FA] dark:bg-gray-800 text-[#1A1A1A] dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600' : 'bg-gray-50 dark:bg-gray-900/50 text-gray-400 dark:text-gray-600 border border-gray-100 dark:border-gray-800 cursor-not-allowed'}`}>
                                            {isAvailable ? 'View Topics and curriculum →' : '🔒 Not Yet Available'}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
    );
}
