// src/pages/PublicShareView.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import Reading from './Reading';
import HamsterLoader from '../components/HamsterLoader';

export default function PublicShareView({ course, topic }) {
    const [readingData, setReadingData] = useState(null);

    useEffect(() => {
        supabase.from('module_readings').select('*').eq('course_code', course).eq('topic', topic).then(({ data }) => {
            setReadingData(data || []);
        });
    }, [course, topic]);

    if (!readingData) return <div className="fixed inset-0 z-[9999] bg-white flex items-center justify-center touch-none overscroll-none"><HamsterLoader /></div>;
    if (readingData.length === 0) return <div className="fixed inset-0 bg-white flex items-center justify-center font-bold text-gray-500 touch-none overscroll-none">Topic not found.</div>;

    return (
        <div className="fixed inset-0 flex flex-col h-[100dvh] bg-white overflow-hidden text-[#1A1A1A] font-sans">
            <header className="bg-[#1A1A1A] px-6 py-3 flex justify-between items-center z-50 shrink-0 touch-none select-none">
                <div className="flex items-center gap-2 text-white font-black text-sm pointer-events-none">
                    <img src="/logo.png" alt="Recall" className="w-6 h-6 brightness-0 invert" /> RECALL
                </div>
                <button onClick={() => window.location.href = '/'} className="bg-[#FF6B00] text-white px-4 py-2 rounded-full text-xs font-bold hover:bg-[#e05d00] transition-colors">Join for Free</button>
            </header>
            <div className="w-full bg-[#FFF9F5] text-[#FF6B00] text-center text-[10px] font-black uppercase tracking-widest py-1.5 z-40 border-b border-[#FFD5C2] shrink-0 touch-none select-none">You are viewing a shared preview</div>
            <div className="flex-1 overflow-y-auto scrollable-content relative">
                <Reading readingData={readingData} activeCourse={{ code: course, title: course }} markTopicCompleted={() => { }} topicStatus={{}} />
            </div>
        </div>
    );
}