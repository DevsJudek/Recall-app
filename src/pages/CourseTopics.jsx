// src/pages/CourseTopics.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { getLookupCourseCodes } from '../utils/courseAliases';

export default function CourseTopics({ activeCourse, setCurrentView, openReadingScreen, topicStatus, openShareTopic }) {
    const [topics, setTopics] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const courseTitle = activeCourse?.title || "Commercial Law";
    const courseCode = activeCourse?.code || "BUL 301";

    useEffect(() => {
        async function fetchTopics() {
            setIsLoading(true);
            const lookupCodes = getLookupCourseCodes(courseCode);
            const { data, error } = await supabase.from('module_readings').select('topic, subtopic').in('course_code', lookupCodes);

            if (data && !error) {
                const topicGroups = {};
                data.forEach(row => {
                    if (!topicGroups[row.topic]) topicGroups[row.topic] = 0;
                    topicGroups[row.topic]++;
                });

                const sortedTopics = Object.keys(topicGroups).sort().map((topicName, index) => ({
                    id: index + 1,
                    title: topicName,
                    subtopics: topicGroups[topicName],
                    time: `${topicGroups[topicName] * 4} mins`
                }));
                setTopics(sortedTopics);
            }
            setIsLoading(false);
        }
        fetchTopics();
    }, [courseCode]);

    return (
        <div className="max-w-5xl mx-auto pb-24">
            <div className="mb-8">
                <div className="flex items-center gap-2 text-xs font-bold text-[#666666] dark:text-gray-400 mb-4">
                    <button onClick={() => setCurrentView('courses')} className="hover:text-[#FF6B00] transition-colors">Courses</button>
                    <span>›</span>
                    <span className="text-[#1A1A1A] dark:text-white">{courseTitle}</span>
                </div>

                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-[#1A1A1A] dark:text-white mb-2">Topics & Curriculum</h1>
                        <p className="text-sm text-[#666666] dark:text-gray-400 font-medium">Master your course syllabus step-by-step with interactive modules.</p>
                    </div>
                    <div className="px-4 py-2 bg-[#FFF9F5] dark:bg-orange-950/20 border border-[#FFD5C2] dark:border-orange-900/50 text-[#FF6B00] rounded-xl text-xs font-extrabold shadow-sm flex items-center gap-2">
                        <span>📚</span> {topics.length} Topics
                    </div>
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center py-20">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF6B00]"></div>
                </div>
            ) : topics.length === 0 ? (
                <div className="bg-[#F8F9FA] dark:bg-[#1A1A1A] rounded-[32px] p-12 text-center border border-dashed border-[#E5E5E5] dark:border-gray-800">
                    <span className="text-4xl mb-4 block">📝</span>
                    <h3 className="text-xl font-black text-[#1A1A1A] dark:text-white mb-2">No topics uploaded yet</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Topics for {courseCode} will appear here once they are added to the database.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {topics.map((topic) => {
                        const statusKey = `${courseCode}_${topic.title}`;
                        const currentStatus = topicStatus[statusKey] || 'NOT STARTED';

                        const isCompleted = currentStatus === 'COMPLETED';
                        const isInProgress = currentStatus === 'IN PROGRESS';

                        const topicMatch = topic.title.match(/^(\d+)\s+(.*)$/);
                        const cleanTitle = topicMatch ? topicMatch[2] : topic.title;

                        return (
                            <div key={topic.id} className={`bg-white dark:bg-[#1A1A1A] border rounded-[24px] p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors shadow-sm ${isCompleted ? 'border-[#3B82F6]/40 dark:border-[#3B82F6]/50' :
                                    isInProgress ? 'border-[#FF6B00]/40 dark:border-[#FF6B00]/50' :
                                        'border-[#E5E5E5] dark:border-gray-800 hover:border-[#FF6B00]/40 dark:hover:border-[#FF6B00]/40'
                                }`}>

                                <div className="flex items-center gap-5">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black shrink-0 ${isCompleted ? 'bg-[#EFF6FF] dark:bg-blue-900/20 text-[#3B82F6] dark:text-blue-400' :
                                            isInProgress ? 'bg-[#FFF2EC] dark:bg-orange-900/20 text-[#FF6B00]' :
                                                'bg-[#F8F9FA] dark:bg-[#242424] text-[#D1D5DB] dark:text-gray-600'
                                        }`}>
                                        {topic.id.toString().padStart(2, '0')}
                                    </div>

                                    <div>
                                        <div className="flex items-center gap-3 mb-1.5">
                                            <h3 className="text-base font-extrabold text-[#1A1A1A] dark:text-white">{cleanTitle}</h3>
                                            <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${isCompleted ? 'bg-[#EFF6FF] dark:bg-blue-900/20 text-[#3B82F6] dark:text-blue-400' :
                                                    isInProgress ? 'bg-[#FFF2EC] dark:bg-orange-900/20 text-[#FF6B00]' :
                                                        'bg-[#F3F4F6] dark:bg-[#242424] text-[#6B7280] dark:text-gray-400'
                                                }`}>
                                                {currentStatus}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-4 text-xs font-bold text-[#9CA3AF] dark:text-gray-500">
                                            <span className="flex items-center gap-1.5">📚 {topic.subtopics} Sub-topics</span>
                                            <span className="flex items-center gap-1.5">⏱ {topic.time}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 self-end md:self-auto">

                                    {/* 🚀 SHARE BUTTON */}
                                    <button
                                        onClick={() => openShareTopic(courseCode, topic.title)}
                                        className="p-3 rounded-[14px] border border-[#E5E5E5] dark:border-gray-700 hover:border-[#FF6B00] dark:hover:border-[#FF6B00] text-gray-400 dark:text-gray-500 hover:text-[#FF6B00] dark:hover:text-[#FF6B00] bg-white dark:bg-[#242424] transition-colors"
                                        title="Share Topic"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                                    </button>

                                    <button
                                        onClick={() => openReadingScreen(activeCourse, topic.title)}
                                        className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${isCompleted ? 'bg-white dark:bg-[#242424] text-[#1A1A1A] dark:text-white border border-[#E5E5E5] dark:border-gray-700 hover:border-[#3B82F6] dark:hover:border-[#3B82F6] hover:bg-[#EFF6FF] dark:hover:bg-blue-900/20' :
                                                isInProgress ? 'bg-[#FF6B00] text-white shadow-md shadow-[#FF6B00]/20 hover:bg-[#E05D00]' :
                                                    'bg-white dark:bg-[#242424] text-[#1A1A1A] dark:text-white border border-[#E5E5E5] dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-[#333333]'
                                            }`}
                                    >
                                        {isCompleted ? 'Review →' : isInProgress ? 'Continue →' : 'Start Topic →'}
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