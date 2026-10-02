// src/pages/CourseLibrary.jsx
import React, { useState } from 'react';

export default function CourseLibrary({ courses, openCourseTopics, getCourseMastery }) {
    // UI States for the new header controls
    const [activeTab, setActiveTab] = useState('Courses');
    const [searchQuery, setSearchQuery] = useState('');
    const [semester, setSemester] = useState('First Semester');

    // Filter courses based on search query
    const filteredCourses = courses.filter(course =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.code.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="max-w-7xl mx-auto pb-12 animate-fade-in">

            {/* TOP BAR: Toggle & Actions */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">

                {/* Courses / Library Toggle */}
                <div className="flex bg-[#F8F9FA] dark:bg-[#1A1A1A] p-1.5 rounded-full border border-[#E5E5E5] dark:border-gray-800 w-full md:w-auto">
                    <button
                        onClick={() => setActiveTab('Courses')}
                        className={`flex-1 md:flex-none px-6 py-2.5 text-sm font-bold rounded-full transition-all ${activeTab === 'Courses'
                            ? 'bg-[#FF6B00] text-white shadow-md shadow-[#FF6B00]/20'
                            : 'text-gray-500 hover:text-[#1A1A1A] dark:hover:text-white'
                            }`}
                    >
                        Courses
                    </button>
                    <button
                        onClick={() => setActiveTab('Library')}
                        className={`flex-1 md:flex-none px-6 py-2.5 text-sm font-bold rounded-full transition-all ${activeTab === 'Library'
                            ? 'bg-[#FF6B00] text-white shadow-md shadow-[#FF6B00]/20'
                            : 'text-gray-500 hover:text-[#1A1A1A] dark:hover:text-white'
                            }`}
                    >
                        Library
                    </button>
                </div>

                {/* Right Side Stats & Manage Button */}
                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                    <div className="px-4 py-2.5 bg-[#FFF2EC] dark:bg-orange-950/30 text-[#FF6B00] border border-[#FFD5C2] dark:border-orange-900/50 rounded-xl text-xs font-extrabold shadow-sm flex items-center gap-2 flex-grow md:flex-grow-0 justify-center">
                        <span>📚</span> {courses.filter(c => c.is_available).length} Enrolled Courses • 1,240 Total PQs
                    </div>
                    <button className="px-4 py-2.5 bg-white dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-gray-800 text-[#1A1A1A] dark:text-white rounded-xl text-sm font-bold shadow-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center gap-2 flex-grow md:flex-grow-0 justify-center">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                        Manage
                    </button>
                </div>
            </div>

            {/* HEADER TEXT */}
            <div className="mb-6">
                <h1 className="text-3xl md:text-[40px] font-black tracking-tight text-[#1A1A1A] dark:text-white mb-2">
                    Your courses
                </h1>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 max-w-2xl leading-relaxed">
                    Master your syllabus topic by topic with curated resources, expert insights, and practice modules.
                </p>
            </div>

            {/* SEARCH & FILTER ROW */}
            <div className="flex flex-col md:flex-row gap-4 mb-10">
                <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </div>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search courses, codes, or keywords..."
                        className="w-full pl-12 pr-4 py-4 bg-[#F8F9FA] dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-gray-800 rounded-2xl text-sm font-bold text-[#1A1A1A] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/20 focus:border-[#FF6B00] transition-all placeholder:font-medium placeholder:text-gray-400"
                    />
                </div>

                <div className="relative shrink-0 w-full md:w-56">
                    <select
                        value={semester}
                        onChange={(e) => setSemester(e.target.value)}
                        className="w-full px-5 py-4 bg-white dark:bg-[#121212] border border-[#E5E5E5] dark:border-gray-800 rounded-2xl text-sm font-bold text-[#1A1A1A] dark:text-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/20 transition-all shadow-sm"
                    >
                        <option value="First Semester">First Semester</option>
                        <option value="Second Semester">Second Semester</option>
                    </select>
                    <div className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-gray-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                </div>
            </div>

            {/* COURSES GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.length > 0 ? filteredCourses.map((course) => {
                    const isAvailable = course.is_available;
                    const mastery = getCourseMastery(course.code, course.topics_count);

                    return (
                        <div key={course.id} className={`bg-white dark:bg-[#121212] rounded-[32px] p-6 border shadow-sm flex flex-col justify-between transition-all ${isAvailable ? 'border-[#E5E5E5] dark:border-gray-800 hover:shadow-md hover:border-[#FFD5C2]' : 'border-gray-100 dark:border-gray-800/50 opacity-60'}`}>
                            <div>
                                <div className="flex justify-between items-center mb-4">
                                    <span className="px-3 py-1.5 bg-[#F8F9FA] dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-gray-800 rounded-lg text-[10px] font-black text-gray-500 uppercase tracking-widest">{course.code}</span>
                                    <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">4 UNITS</span>
                                </div>
                                <h3 className="text-xl font-black mb-4 text-[#1A1A1A] dark:text-white leading-snug">{course.title}</h3>

                                <div className="flex items-center gap-4 text-xs font-bold text-gray-400 mb-6">
                                    <span className="flex items-center gap-1.5">📚 {course.topics_count} Topics</span>
                                    {/* Mocking PQs count to match design */}
                                    <span className="flex items-center gap-1.5">❓ {course.topics_count * 20} PQs</span>
                                </div>

                                {isAvailable && (
                                    <div className="mb-8">
                                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-2">
                                            <span className="text-gray-400">MASTERY</span>
                                            <span className="text-[#FF6B00]">{mastery}%</span>
                                        </div>
                                        <div className="w-full bg-[#F3F4F6] dark:bg-gray-800 h-2 rounded-full overflow-hidden">
                                            <div className="bg-[#FF6B00] h-full rounded-full transition-all duration-500" style={{ width: `${mastery}%` }}></div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className={!isAvailable ? 'mt-8' : 'mt-auto'}>
                                <p className="text-[10px] text-gray-400 mb-4 font-bold uppercase tracking-widest italic">
                                    {isAvailable ? `Last studied: ${course.last_studied}` : 'Join 420 students waiting for this'}
                                </p>

                                {isAvailable ? (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => openCourseTopics(course)}
                                            className="flex-1 py-3.5 bg-[#F8F9FA] dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-gray-800 text-[#1A1A1A] dark:text-white text-sm font-bold rounded-xl hover:bg-gray-100 transition-colors shadow-sm"
                                        >
                                            View Topics
                                        </button>
                                        <button
                                            // You can update this to trigger startPractice if you pass it down from App.jsx
                                            onClick={() => openCourseTopics(course)}
                                            className="flex-1 py-3.5 bg-[#FF6B00] text-white text-sm font-bold rounded-xl shadow-md shadow-[#FF6B00]/20 hover:bg-[#E05D00] transition-colors flex items-center justify-center gap-2"
                                        >
                                            Practice →
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex gap-2">
                                        <button
                                            disabled
                                            className="flex-1 py-3.5 bg-gray-50 border border-gray-100 text-gray-400 text-sm font-bold rounded-xl cursor-not-allowed"
                                        >
                                            View Topics
                                        </button>
                                        <button
                                            disabled
                                            className="flex-1 py-3.5 bg-[#FF6B00] text-white text-sm font-bold rounded-xl flex items-center justify-center gap-2 relative overflow-hidden"
                                        >
                                            <span className="opacity-0">Unlock Course</span>
                                            <div className="absolute inset-0 flex items-center justify-center bg-white/90">
                                                <span className="text-xl">🔒</span>
                                            </div>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                }) : (
                    <div className="col-span-full py-20 text-center bg-[#F8F9FA] rounded-[32px] border border-dashed border-[#E5E5E5]">
                        <span className="text-4xl mb-4 block">🔍</span>
                        <h3 className="text-lg font-black text-[#1A1A1A] mb-2">No courses found</h3>
                        <p className="text-sm text-gray-500 font-medium">Try searching for a different course code or keyword.</p>
                    </div>
                )}
            </div>
        </div>
    );
} 