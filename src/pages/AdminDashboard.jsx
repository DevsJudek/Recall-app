// src/pages/AdminDashboard.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../supabase';

export default function AdminDashboard({ goBack }) {
    const [activeTab, setActiveTab] = useState('overview');
    const [isLoading, setIsLoading] = useState(true);

    // Data States
    const [profiles, setProfiles] = useState([]);
    const [courses, setCourses] = useState([]);
    const [readings, setReadings] = useState([]);
    const [questions, setQuestions] = useState([]);

    // Nested View States
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [selectedTopic, setSelectedTopic] = useState(null);

    const fetchAllData = async () => {
        setIsLoading(true);
        const [
            { data: profilesData },
            { data: coursesData },
            { data: readingsData },
            { data: questionsData }
        ] = await Promise.all([
            supabase.from('profiles').select('*').order('points', { ascending: false }),
            supabase.from('courses').select('*').order('level'),
            supabase.from('module_readings').select('*'),
            supabase.from('questions').select('*')
        ]);

        if (profilesData) setProfiles(profilesData);
        if (coursesData) setCourses(coursesData);
        if (readingsData) setReadings(readingsData);
        if (questionsData) setQuestions(questionsData);

        setIsLoading(false);
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchAllData();
    }, []);

    // Derive unique topics for the selected course
    const courseReadings = readings.filter(r => r.course_code === selectedCourse?.code);
    const courseQuestions = questions.filter(q => q.course_code === selectedCourse?.code);

    const uniqueTopics = [...new Set([
        ...courseReadings.map(r => r.topic),
        ...courseQuestions.map(q => q.topic)
    ])].filter(Boolean); // removes null/undefined

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in font-sans pb-32">

            {/* HEADER */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <button onClick={goBack} className="w-10 h-10 bg-[#F8F9FA] border border-[#E5E5E5] rounded-full flex items-center justify-center font-bold text-[#1A1A1A] hover:bg-white transition-colors">←</button>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-black text-[#1A1A1A] tracking-tight">Admin Console</h1>
                        <p className="text-xs font-bold text-[#FF6B00] uppercase tracking-widest mt-1">Superuser Access</p>
                    </div>
                </div>
                <button onClick={fetchAllData} className="px-4 py-2 bg-white border border-[#E5E5E5] rounded-xl text-xs font-bold shadow-sm hover:border-[#FF6B00] transition-colors">
                    🔄 Refresh
                </button>
            </div>

            {/* TOP NAVIGATION TABS */}
            <div className="flex gap-2 p-1 bg-[#F8F9FA] border border-[#E5E5E5] rounded-2xl w-full max-w-md mb-8 overflow-x-auto">
                {['overview', 'profiles', 'content'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex-1 py-2.5 px-4 text-xs font-black uppercase tracking-widest rounded-xl transition-all capitalize ${activeTab === tab ? 'bg-white shadow-sm text-[#FF6B00] border border-gray-100' : 'text-gray-400 hover:text-[#1A1A1A]'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {isLoading ? (
                <div className="text-center py-20 text-sm font-bold text-gray-400 animate-pulse">Loading Database...</div>
            ) : (
                <>
                    {/* ================= OVERVIEW TAB ================= */}
                    {activeTab === 'overview' && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white border border-[#E5E5E5] rounded-[32px] p-8 shadow-sm flex flex-col items-center text-center">
                                <div className="w-16 h-16 bg-[#FFF9F5] text-[#FF6B00] border border-[#FFD5C2] rounded-2xl flex items-center justify-center text-3xl mb-4">👥</div>
                                <h3 className="text-4xl font-black text-[#1A1A1A]">{profiles.length}</h3>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2">Registered Users</p>
                            </div>
                            <div className="bg-white border border-[#E5E5E5] rounded-[32px] p-8 shadow-sm flex flex-col items-center text-center">
                                <div className="w-16 h-16 bg-blue-50 text-blue-500 border border-blue-100 rounded-2xl flex items-center justify-center text-3xl mb-4">📚</div>
                                <h3 className="text-4xl font-black text-[#1A1A1A]">{courses.length}</h3>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2">Active Courses</p>
                            </div>
                            <div className="bg-white border border-[#E5E5E5] rounded-[32px] p-8 shadow-sm flex flex-col items-center text-center">
                                <div className="w-16 h-16 bg-emerald-50 text-emerald-500 border border-emerald-100 rounded-2xl flex items-center justify-center text-3xl mb-4">❓</div>
                                <h3 className="text-4xl font-black text-[#1A1A1A]">{questions.length}</h3>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2">Total Questions</p>
                            </div>
                        </div>
                    )}

                    {/* ================= PROFILES TAB ================= */}
                    {activeTab === 'profiles' && (
                        <div className="bg-white border border-[#E5E5E5] rounded-[32px] p-6 shadow-sm overflow-hidden">
                            <h2 className="text-xl font-black text-[#1A1A1A] mb-6 px-2">User Database</h2>
                            <div className="space-y-3">
                                {profiles.map((user, idx) => (
                                    <div key={user.id} className="flex items-center justify-between p-4 bg-[#F8F9FA] rounded-2xl border border-transparent hover:border-[#E5E5E5] transition-all">
                                        <div className="flex items-center gap-4">
                                            <span className="text-sm font-black text-gray-400 w-6">#{idx + 1}</span>
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FFD5C2] to-[#FF6B00] text-white flex items-center justify-center font-black overflow-hidden shadow-sm">
                                                {user.avatar && user.avatar.startsWith('http') ? <img src={user.avatar} className="w-full h-full object-cover" /> : user.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-bold text-[#1A1A1A] text-sm">{user.name}</p>
                                                <p className="text-[10px] font-bold text-gray-500">{user.email || 'No email'}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-6 text-right">
                                            <div>
                                                <p className="text-sm font-black text-[#FF6B00]">🔥 {user.current_streak || 0}</p>
                                                <p className="text-[8px] font-black tracking-widest text-gray-400 uppercase mt-0.5">Streak</p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-[#1A1A1A]">{user.points}</p>
                                                <p className="text-[8px] font-black tracking-widest text-gray-400 uppercase mt-0.5">XP</p>
                                            </div>
                                            <button className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-[10px] font-bold text-gray-600 hover:border-[#FF6B00] transition-colors">Edit</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ================= CONTENT MANAGER TAB (NESTED UI) ================= */}
                    {activeTab === 'content' && (
                        <div className="flex flex-col lg:flex-row gap-6">

                            {/* LEFT COLUMN: COURSES */}
                            <div className="w-full lg:w-1/3 flex flex-col gap-4">
                                <div className="bg-white border border-[#E5E5E5] rounded-[32px] p-6 shadow-sm">
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-lg font-black text-[#1A1A1A]">1. Select Course</h2>
                                        <button className="text-[#FF6B00] text-xl hover:scale-110 transition-transform">⊕</button>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        {courses.map(course => (
                                            <button
                                                key={course.id}
                                                onClick={() => { setSelectedCourse(course); setSelectedTopic(null); }}
                                                className={`text-left px-5 py-4 rounded-2xl border transition-all ${selectedCourse?.id === course.id
                                                        ? 'bg-[#FFF9F5] border-[#FFD5C2] shadow-sm'
                                                        : 'bg-[#F8F9FA] border-[#E5E5E5] hover:bg-white'
                                                    }`}
                                            >
                                                <p className={`text-[10px] font-black tracking-widest uppercase mb-1 ${selectedCourse?.id === course.id ? 'text-[#FF6B00]' : 'text-gray-400'}`}>{course.code}</p>
                                                <p className="font-bold text-sm text-[#1A1A1A] truncate">{course.title}</p>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* MIDDLE/RIGHT COLUMN: TOPICS & DATA */}
                            <div className="w-full lg:w-2/3 flex flex-col gap-4">
                                {selectedCourse ? (
                                    <div className="bg-white border border-[#E5E5E5] rounded-[32px] p-6 shadow-sm min-h-[500px]">
                                        <div className="mb-8 border-b border-gray-100 pb-6">
                                            <h2 className="text-2xl font-black text-[#1A1A1A] mb-1">{selectedCourse.code}: {selectedCourse.title}</h2>
                                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">2. Select a Topic to view content</p>
                                        </div>

                                        {/* Horizontal Topic Pills */}
                                        <div className="flex flex-wrap gap-2 mb-8">
                                            {uniqueTopics.length > 0 ? uniqueTopics.map(topic => (
                                                <button
                                                    key={topic}
                                                    onClick={() => setSelectedTopic(topic)}
                                                    className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${selectedTopic === topic
                                                            ? 'bg-[#1A1A1A] text-white border-black shadow-md'
                                                            : 'bg-[#F8F9FA] text-[#666666] border-[#E5E5E5] hover:border-gray-300'
                                                        }`}
                                                >
                                                    {topic}
                                                </button>
                                            )) : (
                                                <p className="text-sm font-medium text-gray-400 italic">No topics created yet.</p>
                                            )}
                                            <button className="px-4 py-2 rounded-xl text-xs font-bold bg-[#FFF9F5] text-[#FF6B00] border border-[#FFD5C2] border-dashed hover:bg-[#FFF2EC]">+ New Topic</button>
                                        </div>

                                        {/* NESTED CONTENT: Readings & Questions for Selected Topic */}
                                        {selectedTopic && (
                                            <div className="animate-fade-in grid grid-cols-1 md:grid-cols-2 gap-6">

                                                {/* Modules Column */}
                                                <div>
                                                    <div className="flex justify-between items-center mb-4">
                                                        <h3 className="text-sm font-black text-[#1A1A1A] uppercase tracking-widest">Readings</h3>
                                                        <button className="text-[#FF6B00] text-xs font-bold bg-[#FFF9F5] px-3 py-1 rounded-lg border border-[#FFD5C2]">+ Add</button>
                                                    </div>
                                                    <div className="space-y-3">
                                                        {courseReadings.filter(r => r.topic === selectedTopic).map((reading, i) => (
                                                            <div key={i} className="p-4 bg-[#F8F9FA] border border-[#E5E5E5] rounded-2xl">
                                                                <p className="text-xs font-bold text-[#1A1A1A] mb-2">{reading.subtopic || 'Module Section'}</p>
                                                                <p className="text-[10px] text-gray-500 line-clamp-2 leading-relaxed">{reading.content_body}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Questions Column */}
                                                <div>
                                                    <div className="flex justify-between items-center mb-4">
                                                        <h3 className="text-sm font-black text-[#1A1A1A] uppercase tracking-widest">Questions</h3>
                                                        <button className="text-[#FF6B00] text-xs font-bold bg-[#FFF9F5] px-3 py-1 rounded-lg border border-[#FFD5C2]">+ Add</button>
                                                    </div>
                                                    <div className="space-y-3">
                                                        {courseQuestions.filter(q => q.topic === selectedTopic).map((q, i) => (
                                                            <div key={i} className="p-4 bg-white border border-gray-200 shadow-sm rounded-2xl">
                                                                <p className="text-[11px] font-bold text-[#1A1A1A] mb-3 leading-snug">{q.question_text}</p>
                                                                <div className="space-y-1.5">
                                                                    {q.options && q.options.map((opt, oIdx) => (
                                                                        <div key={oIdx} className={`text-[9px] px-2 py-1.5 rounded-md border font-bold ${oIdx === q.correct_option_index ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-gray-50 text-gray-500 border-gray-100'}`}>
                                                                            {['A', 'B', 'C', 'D'][oIdx]}. {opt}
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="bg-[#F8F9FA] border border-dashed border-[#E5E5E5] rounded-[32px] h-[500px] flex flex-col items-center justify-center text-center p-8">
                                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-3xl mb-4 shadow-sm border border-gray-100">👈</div>
                                        <h3 className="text-lg font-black text-[#1A1A1A] mb-1">Select a Course</h3>
                                        <p className="text-sm font-medium text-gray-500 max-w-xs">Click on any course on the left to manage its modules and quiz questions.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                </>
            )}
        </div>
    );
}