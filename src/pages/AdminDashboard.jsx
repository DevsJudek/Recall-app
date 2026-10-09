// src/pages/AdminDashboard.jsx
import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../supabase';
import { getLookupCourseCodes } from '../utils/courseAliases';

export default function AdminDashboard({ goBack }) {
    const [activeTab, setActiveTab] = useState('overview');
    const [isLoading, setIsLoading] = useState(true);

    // Data States
    const [profiles, setProfiles] = useState([]);
    const [courses, setCourses] = useState([]);
    const [readings, setReadings] = useState([]);
    const [allQuestionsMeta, setAllQuestionsMeta] = useState([]);

    // Content UI States
    const [contentViewMode, setContentViewMode] = useState('explorer'); // 'explorer' | 'all_courses'
    const [courseSearch, setCourseSearch] = useState('');
    const [levelFilter, setLevelFilter] = useState('ALL'); // 'ALL' | '200L' | '300L' | 'Other'
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [topicSearch, setTopicSearch] = useState('');

    // Topic Inspector Modal / Drawer
    const [inspectingTopic, setInspectingTopic] = useState(null);
    const [inspectingCourse, setInspectingCourse] = useState(null);
    const [topicQuestions, setTopicQuestions] = useState([]);
    const [isLoadingTopicQuestions, setIsLoadingTopicQuestions] = useState(false);
    const [inspectorTab, setInspectorTab] = useState('questions'); // 'questions' | 'readings'

    // Expanded courses in 'all_courses' view
    const [expandedCourseCodes, setExpandedCourseCodes] = useState({});

    // Overview Curriculum & Questions section states
    const [overviewExpandedCourses, setOverviewExpandedCourses] = useState({});
    const [overviewSearch, setOverviewSearch] = useState('');
    const [overviewLevel, setOverviewLevel] = useState('ALL');

    const isOverviewCourseExpanded = (code) => overviewExpandedCourses[code] !== false;

    const toggleOverviewCourse = (code) => {
        setOverviewExpandedCourses(prev => ({
            ...prev,
            [code]: prev[code] === false ? true : false
        }));
    };

    const expandAllOverview = () => {
        const next = {};
        courses.forEach(c => { next[c.code] = true; });
        setOverviewExpandedCourses(next);
    };

    const collapseAllOverview = () => {
        const next = {};
        courses.forEach(c => { next[c.code] = false; });
        setOverviewExpandedCourses(next);
    };

    const fetchAllData = async () => {
        setIsLoading(true);
        try {
            // 1. Fetch profiles, courses, module_readings
            const [
                { data: profilesData },
                { data: coursesData },
                { data: readingsData }
            ] = await Promise.all([
                supabase.from('profiles').select('*').order('points', { ascending: false }),
                supabase.from('courses').select('*').order('level'),
                supabase.from('module_readings').select('*')
            ]);

            // 2. Paginated fetch of ALL questions metadata (course_code, topic)
            // Supabase REST caps single selects at 1000 rows. We page through all 3000+ rows.
            let allQ = [];
            let from = 0;
            const pageSize = 1000;
            while (true) {
                const { data, error } = await supabase
                    .from('questions')
                    .select('course_code, topic')
                    .range(from, from + pageSize - 1);
                if (error || !data || data.length === 0) break;
                allQ = allQ.concat(data);
                if (data.length < pageSize) break;
                from += pageSize;
            }

            // 3. Known fallback courses that have active content
            const fallbackCourses = [
                { id: 'fallback-pul-205', code: 'PUL 205', title: 'Human Rights I', level: '200L', department: 'Law', type: 'Core', semester: '1st Semester', is_available: true },
                { id: 'fallback-jpl-203', code: 'JPL 203', title: 'Islamic Law I', level: '200L', department: 'Law', type: 'Core', semester: '1st Semester', is_available: true },
                { id: 'fallback-jpl-305', code: 'JPL 305', title: 'Family Law I', level: '300L', department: 'Law', type: 'Core', semester: '1st Semester', is_available: true, alias_code: 'JPL 303' },
                { id: 'fallback-bul-305', code: 'BUL 305', title: 'Labour Law I', level: '300L', department: 'Law', type: 'Core', semester: '1st Semester', is_available: true, alias_code: 'PUL 303' },
                { id: 'fallback-bul-303', code: 'BUL 303', title: 'Banking Law I', level: '300L', department: 'Law', type: 'Core', semester: '1st Semester', is_available: true },
                { id: 'fallback-phl-319', code: 'PHL 319', title: 'Philosophy of Law I', level: '300L', department: 'Philosophy', type: 'Restricted', semester: '1st Semester', is_available: true }
            ];

            const mergedRaw = [...(coursesData || [])];
            fallbackCourses.forEach(fb => {
                if (!mergedRaw.find(c => c.code === fb.code)) {
                    mergedRaw.push(fb);
                }
            });

            // 4. Discover any other course codes in questions or readings
            const existingCodes = new Set(mergedRaw.map(c => c.code));
            const aliasedCodes = new Set(['PUL 303', 'JPL 303']); // Handled via BUL 305 / JPL 305
            allQ.forEach(q => {
                const code = q.course_code?.trim().toUpperCase();
                if (code && !existingCodes.has(code) && !aliasedCodes.has(code)) {
                    existingCodes.add(code);
                    mergedRaw.push({
                        id: 'auto-' + code,
                        code: code,
                        title: code,
                        level: code.match(/\d00/)?.[0] || 'Other',
                        department: 'General',
                        type: 'Elective',
                        semester: '1st Semester',
                        is_available: true
                    });
                }
            });

            // 5. Enrich each course with its topics, questions count per topic, and readings count per topic
            const enrichedCourses = mergedRaw.map(course => {
                const lookupCodes = getLookupCourseCodes(course.code);
                const cQuestions = allQ.filter(q => lookupCodes.includes(q.course_code));
                const cReadings = (readingsData || []).filter(r => lookupCodes.includes(r.course_code));

                const topicMap = {};
                cQuestions.forEach(q => {
                    const t = (q.topic || '').trim();
                    if (!t) return;
                    if (!topicMap[t]) topicMap[t] = { name: t, questionsCount: 0, readingsCount: 0 };
                    topicMap[t].questionsCount += 1;
                });

                cReadings.forEach(r => {
                    const t = (r.topic || '').trim();
                    if (!t) return;
                    if (!topicMap[t]) topicMap[t] = { name: t, questionsCount: 0, readingsCount: 0 };
                    topicMap[t].readingsCount += 1;
                });

                const sortedTopics = Object.values(topicMap).sort((a, b) =>
                    a.name.localeCompare(b.name, undefined, { numeric: true })
                );

                return {
                    ...course,
                    topics: sortedTopics,
                    topicsCount: sortedTopics.length,
                    totalQuestions: cQuestions.length,
                    totalReadings: cReadings.length,
                    isAliased: lookupCodes.length > 1
                };
            });

            // Sort courses: 200L, then 300L, then Other, then alphabetical by code
            enrichedCourses.sort((a, b) => {
                const levelA = a.level || '999';
                const levelB = b.level || '999';
                if (levelA !== levelB) return levelA.localeCompare(levelB);
                return (a.code || '').localeCompare(b.code || '');
            });

            if (profilesData) setProfiles(profilesData);
            if (readingsData) setReadings(readingsData);
            setAllQuestionsMeta(allQ);
            setCourses(enrichedCourses);

            // Auto-select first course if none selected
            setSelectedCourse(prev => {
                if (!prev) return enrichedCourses[0] || null;
                return enrichedCourses.find(c => c.code === prev.code) || enrichedCourses[0] || null;
            });

        } catch (err) {
            console.error('Error fetching admin data:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAllData();
    }, []);

    // Filter courses based on search & level
    const filteredCourses = useMemo(() => {
        return courses.filter(c => {
            const matchesLevel =
                levelFilter === 'ALL'
                    ? true
                    : levelFilter === 'Other'
                        ? !['200L', '300L'].includes(c.level)
                        : c.level === levelFilter;

            const q = courseSearch.trim().toLowerCase();
            const matchesSearch =
                !q ||
                c.code?.toLowerCase().includes(q) ||
                c.title?.toLowerCase().includes(q) ||
                c.topics?.some(t => t.name.toLowerCase().includes(q));

            return matchesLevel && matchesSearch;
        });
    }, [courses, levelFilter, courseSearch]);

    // Filter courses for Overview tab
    const filteredOverviewCourses = useMemo(() => {
        return courses.filter(c => {
            const matchesLevel =
                overviewLevel === 'ALL'
                    ? true
                    : overviewLevel === 'Other'
                        ? !['200L', '300L'].includes(c.level)
                        : c.level === overviewLevel;

            const q = overviewSearch.trim().toLowerCase();
            const matchesSearch =
                !q ||
                c.code?.toLowerCase().includes(q) ||
                c.title?.toLowerCase().includes(q) ||
                c.topics?.some(t => t.name.toLowerCase().includes(q));

            return matchesLevel && matchesSearch;
        });
    }, [courses, overviewLevel, overviewSearch]);

    // Inspect a topic's full questions and readings
    const openTopicInspector = async (topicName, course) => {
        setInspectingTopic(topicName);
        setInspectingCourse(course);
        setInspectorTab('questions');
        setIsLoadingTopicQuestions(true);

        try {
            const lookupCodes = getLookupCourseCodes(course.code);
            const { data } = await supabase
                .from('questions')
                .select('*')
                .in('course_code', lookupCodes)
                .eq('topic', topicName);

            setTopicQuestions(data || []);
        } catch (err) {
            console.error('Error fetching questions for topic:', err);
            setTopicQuestions([]);
        } finally {
            setIsLoadingTopicQuestions(false);
        }
    };

    const closeTopicInspector = () => {
        setInspectingTopic(null);
        setInspectingCourse(null);
        setTopicQuestions([]);
    };

    // Toggle course in 'all_courses' view
    const toggleCourseExpand = (code) => {
        setExpandedCourseCodes(prev => ({
            ...prev,
            [code]: !prev[code]
        }));
    };

    const expandAllCourses = () => {
        const next = {};
        courses.forEach(c => { next[c.code] = true; });
        setExpandedCourseCodes(next);
    };

    const collapseAllCourses = () => {
        setExpandedCourseCodes({});
    };

    // Selected course's filtered topics
    const selectedCourseFilteredTopics = useMemo(() => {
        if (!selectedCourse) return [];
        const q = topicSearch.trim().toLowerCase();
        if (!q) return selectedCourse.topics || [];
        return (selectedCourse.topics || []).filter(t => t.name.toLowerCase().includes(q));
    }, [selectedCourse, topicSearch]);

    // Readings for inspected topic
    const inspectedTopicReadings = useMemo(() => {
        if (!inspectingTopic || !inspectingCourse) return [];
        const lookupCodes = getLookupCourseCodes(inspectingCourse.code);
        return readings.filter(r =>
            lookupCodes.includes(r.course_code) &&
            (r.topic || '').trim() === inspectingTopic.trim()
        );
    }, [inspectingTopic, inspectingCourse, readings]);

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in font-sans pb-32">

            {/* HEADER */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-4">
                    <button
                        onClick={goBack}
                        className="w-10 h-10 bg-[#F8F9FA] border border-[#E5E5E5] rounded-full flex items-center justify-center font-bold text-[#1A1A1A] hover:bg-white transition-colors cursor-pointer"
                    >
                        ←
                    </button>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-black text-[#1A1A1A] tracking-tight">Admin Console</h1>
                        <p className="text-xs font-bold text-[#FF6B00] uppercase tracking-widest mt-0.5">Superuser Access</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={fetchAllData}
                        className="px-4 py-2 bg-white border border-[#E5E5E5] rounded-[14px] text-xs font-bold shadow-sm hover:border-[#FF6B00] transition-colors flex items-center gap-2 cursor-pointer"
                    >
                        <span>🔄</span> Refresh Database
                    </button>
                </div>
            </div>

            {/* TOP NAVIGATION TABS */}
            <div className="flex gap-2 p-1 bg-[#F8F9FA] border border-[#E5E5E5] rounded-2xl w-full max-w-md mb-8 overflow-x-auto">
                {['overview', 'profiles', 'content'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex-1 py-2.5 px-4 text-xs font-black uppercase tracking-widest rounded-xl transition-all capitalize cursor-pointer ${
                            activeTab === tab
                                ? 'bg-white shadow-sm text-[#FF6B00] border border-gray-100'
                                : 'text-gray-400 hover:text-[#1A1A1A]'
                        }`}
                    >
                        {tab === 'content' ? '📚 Content & MCQs' : tab}
                    </button>
                ))}
            </div>

            {isLoading ? (
                <div className="bg-white border border-[#E5E5E5] rounded-[32px] p-16 text-center shadow-sm">
                    <div className="w-12 h-12 border-4 border-[#FF6B00] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-sm font-black text-[#1A1A1A]">Loading Database...</p>
                    <p className="text-xs text-gray-400 mt-1">Synchronizing courses, topics, and past questions metadata</p>
                </div>
            ) : (
                <>
                    {/* ================= OVERVIEW TAB ================= */}
                    {activeTab === 'overview' && (
                        <div className="space-y-8">
                            {/* Summary Cards */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div className="bg-white border border-[#E5E5E5] rounded-[32px] p-6 shadow-sm flex flex-col items-center text-center">
                                    <div className="w-14 h-14 bg-[#FFF9F5] text-[#FF6B00] border border-[#FFD5C2] rounded-2xl flex items-center justify-center text-2xl mb-3">👥</div>
                                    <h3 className="text-3xl font-black text-[#1A1A1A]">{profiles.length}</h3>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Registered Users</p>
                                </div>
                                <div className="bg-white border border-[#E5E5E5] rounded-[32px] p-6 shadow-sm flex flex-col items-center text-center">
                                    <div className="w-14 h-14 bg-blue-50 text-blue-500 border border-blue-100 rounded-2xl flex items-center justify-center text-2xl mb-3">📚</div>
                                    <h3 className="text-3xl font-black text-[#1A1A1A]">{courses.length}</h3>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Active Courses</p>
                                </div>
                                <div className="bg-white border border-[#E5E5E5] rounded-[32px] p-6 shadow-sm flex flex-col items-center text-center">
                                    <div className="w-14 h-14 bg-emerald-50 text-emerald-500 border border-emerald-100 rounded-2xl flex items-center justify-center text-2xl mb-3">❓</div>
                                    <h3 className="text-3xl font-black text-[#1A1A1A]">{allQuestionsMeta.length}</h3>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Past Questions (MCQs)</p>
                                </div>
                                <div className="bg-white border border-[#E5E5E5] rounded-[32px] p-6 shadow-sm flex flex-col items-center text-center">
                                    <div className="w-14 h-14 bg-purple-50 text-purple-500 border border-purple-100 rounded-2xl flex items-center justify-center text-2xl mb-3">📖</div>
                                    <h3 className="text-3xl font-black text-[#1A1A1A]">{readings.length}</h3>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Module Readings</p>
                                </div>
                            </div>

                            {/* Curriculum & Questions Overview Section */}
                            <div className="bg-white border border-[#E5E5E5] rounded-[24px] sm:rounded-[32px] p-4 sm:p-6 shadow-sm">
                                
                                {/* Section Header */}
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 px-1">
                                    <div>
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <h2 className="text-base sm:text-lg font-black text-[#1A1A1A]">Curriculum & Questions Overview</h2>
                                            <span className="text-[10px] font-black px-2 py-0.5 bg-[#FFF9F5] text-[#FF6B00] border border-[#FFD5C2] rounded-md">
                                                {allQuestionsMeta.length} MCQs Total
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-400 font-medium mt-0.5">
                                            Distribution of active courses, their topics, and the exact past questions count for every topic
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
                                        <button
                                            onClick={expandAllOverview}
                                            className="px-2.5 py-1.5 bg-gray-50 border border-gray-200 text-gray-700 rounded-[14px] text-[11px] font-bold hover:bg-gray-100 transition-colors cursor-pointer"
                                        >
                                            Expand All
                                        </button>
                                        <button
                                            onClick={collapseAllOverview}
                                            className="px-2.5 py-1.5 bg-gray-50 border border-gray-200 text-gray-700 rounded-[14px] text-[11px] font-bold hover:bg-gray-100 transition-colors cursor-pointer"
                                        >
                                            Collapse All
                                        </button>
                                        <button
                                            onClick={() => setActiveTab('content')}
                                            className="text-xs font-black text-[#FF6B00] hover:underline cursor-pointer ml-1"
                                        >
                                            Explorer View →
                                        </button>
                                    </div>
                                </div>

                                {/* Filters & Search on Mobile & Desktop */}
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 p-3 bg-[#F8F9FA] rounded-2xl border border-gray-100">
                                    {/* Level Tabs */}
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                        {['ALL', '200L', '300L', 'Other'].map(lvl => (
                                            <button
                                                key={lvl}
                                                onClick={() => setOverviewLevel(lvl)}
                                                className={`px-3 py-1 rounded-xl text-[11px] font-black transition-all cursor-pointer ${
                                                    overviewLevel === lvl
                                                        ? 'bg-[#1A1A1A] text-white shadow-xs'
                                                        : 'bg-white text-gray-500 hover:text-black border border-gray-200'
                                                }`}
                                            >
                                                {lvl}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Search Bar */}
                                    <div className="relative w-full sm:w-64">
                                        <input
                                            type="text"
                                            placeholder="Search course or topic..."
                                            value={overviewSearch}
                                            onChange={e => setOverviewSearch(e.target.value)}
                                            className="w-full bg-white border border-[#E5E5E5] rounded-xl px-3.5 py-1.5 text-xs font-bold placeholder-gray-400 focus:outline-none focus:border-[#FF6B00]"
                                        />
                                        {overviewSearch && (
                                            <button
                                                onClick={() => setOverviewSearch('')}
                                                className="absolute right-3 top-2 text-xs text-gray-400 hover:text-gray-600 cursor-pointer"
                                            >
                                                ✕
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Courses & Topics Cards (Optimized for Mobile & Desktop) */}
                                <div className="space-y-4">
                                    {filteredOverviewCourses.map(course => {
                                        const isExpanded = isOverviewCourseExpanded(course.code);
                                        return (
                                            <div
                                                key={course.code}
                                                className="border border-[#E5E5E5] rounded-2xl sm:rounded-[24px] overflow-hidden shadow-xs bg-white transition-all"
                                            >
                                                {/* Course Header Bar (Clickable to Expand/Collapse) */}
                                                <div
                                                    onClick={() => toggleOverviewCourse(course.code)}
                                                    className="p-3.5 sm:p-4 bg-[#F8F9FA] hover:bg-gray-100/70 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer"
                                                >
                                                    <div className="flex items-start sm:items-center gap-2.5 min-w-0">
                                                        <span className="text-xs font-black px-2.5 py-1 bg-[#1A1A1A] text-white rounded-lg uppercase tracking-wider shrink-0 mt-0.5 sm:mt-0">
                                                            {course.code}
                                                        </span>
                                                        <div className="min-w-0 flex-1">
                                                            <div className="flex items-center gap-2 flex-wrap">
                                                                <h3 className="text-xs sm:text-sm font-black text-[#1A1A1A] leading-snug">
                                                                    {course.title}
                                                                </h3>
                                                                <span className="text-[10px] font-bold px-2 py-0.5 bg-white border border-gray-200 rounded-md text-gray-600 shrink-0">
                                                                    {course.level}
                                                                </span>
                                                                {course.isAliased && (
                                                                    <span className="text-[9px] font-bold px-1.5 py-0.5 bg-orange-50 text-[#FF6B00] border border-[#FFD5C2] rounded-md shrink-0">
                                                                        Aliased in DB
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center justify-between sm:justify-end gap-2.5 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-200/60 shrink-0">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-[10px] sm:text-xs font-bold text-gray-600 bg-white px-2 py-0.5 rounded-lg border border-gray-200">
                                                                📑 {course.topicsCount} Topics
                                                            </span>
                                                            <span className={`text-[10px] sm:text-xs font-black px-2.5 py-0.5 rounded-lg ${
                                                                course.totalQuestions > 0
                                                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                                    : 'bg-gray-100 text-gray-400'
                                                            }`}>
                                                                ❓ {course.totalQuestions} Questions
                                                            </span>
                                                        </div>
                                                        <span className="w-6 h-6 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-[10px] font-black text-gray-500 shrink-0">
                                                            {isExpanded ? '▲' : '▼'}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Expanded Topics List (Shows each topic and exact past questions count) */}
                                                {isExpanded && (
                                                    <div className="p-3 sm:p-4 bg-white border-t border-gray-100">
                                                        {course.topics && course.topics.length > 0 ? (
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-2.5">
                                                                {course.topics.map((topic, tIdx) => (
                                                                    <div
                                                                        key={topic.name}
                                                                        className="p-3 bg-[#F8F9FA] border border-gray-200/80 rounded-xl flex items-center justify-between gap-2.5 hover:border-[#FFD5C2] hover:bg-[#FFFDFB] transition-all"
                                                                    >
                                                                        <div className="flex items-start gap-2 min-w-0 flex-1">
                                                                            <span className="text-[10px] font-black text-gray-400 w-5 shrink-0 mt-0.5">
                                                                                #{tIdx + 1}
                                                                            </span>
                                                                            <div className="min-w-0 flex-1">
                                                                                <p className="text-xs font-bold text-[#1A1A1A] leading-snug break-words">
                                                                                    {topic.name}
                                                                                </p>
                                                                                <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                                                                                    {/* EXACT PAST QUESTIONS BADGE */}
                                                                                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-black ${
                                                                                        topic.questionsCount > 0
                                                                                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                                                            : 'bg-gray-100 text-gray-400 border border-gray-200'
                                                                                    }`}>
                                                                                        <span>❓</span> {topic.questionsCount} Past Questions
                                                                                    </span>

                                                                                    {/* READINGS COUNT */}
                                                                                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                                                                                        <span>📖</span> {topic.readingsCount} Notes
                                                                                    </span>
                                                                                </div>
                                                                            </div>
                                                                        </div>

                                                                        <div className="shrink-0 self-end sm:self-center">
                                                                            <button
                                                                                onClick={() => openTopicInspector(topic.name, course)}
                                                                                className="px-2.5 py-1.5 bg-white border border-gray-200 text-[#1A1A1A] hover:text-[#FF6B00] hover:border-[#FF6B00] rounded-[14px] text-[10px] font-black shadow-xs transition-colors cursor-pointer"
                                                                            >
                                                                                Inspect →
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <div className="text-center py-6 text-xs font-bold text-gray-400">
                                                                No topics recorded for this course yet.
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}

                                    {filteredOverviewCourses.length === 0 && (
                                        <div className="p-8 text-center bg-[#F8F9FA] rounded-2xl border border-dashed border-gray-200">
                                            <p className="text-xs font-bold text-gray-400">
                                                No courses match your filter or search query.
                                            </p>
                                        </div>
                                    )}
                                </div>

                            </div>
                        </div>
                    )}

                    {/* ================= PROFILES TAB ================= */}
                    {activeTab === 'profiles' && (
                        <div className="bg-white border border-[#E5E5E5] rounded-[32px] p-6 shadow-sm overflow-hidden">
                            <div className="flex items-center justify-between mb-4 px-2">
                                <div>
                                    <h2 className="text-xl font-black text-[#1A1A1A]">User Database</h2>
                                    <p className="text-xs text-gray-400 font-medium">{profiles.length} registered students</p>
                                </div>
                            </div>
                            
                            {/* OVERVIEW PILLS */}
                            <div className="flex flex-wrap gap-2 px-2 mb-8">
                                {Object.entries(groupedProfiles).sort((a, b) => b[1].length - a[1].length).map(([groupName, users]) => (
                                    <div key={groupName} className="flex items-center bg-[#F8F9FA] border border-[#E5E5E5] rounded-full px-3 py-1.5 shadow-sm">
                                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest mr-2">{groupName}</span>
                                        <span className="text-[10px] font-black text-[#FF6B00] bg-[#FFF5F0] px-2 py-0.5 rounded-full border border-[#FFD5C2]">
                                            {users.length} {users.length === 1 ? 'Student' : 'Students'}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <div className="space-y-3">
                                {Object.entries(groupedProfiles).map(([groupName, usersInGroup]) => (
                                    <div key={groupName} className="mb-8">
                                        <h3 className="text-sm font-black text-[#FF6B00] uppercase tracking-widest mb-4 bg-[#FFF5F0] inline-block px-3 py-1.5 rounded-lg border border-[#FFD5C2]">
                                            {groupName} <span className="text-[#1A1A1A] ml-2">({usersInGroup.length} Students)</span>
                                        </h3>
                                        <div className="space-y-3">
                                            {usersInGroup.map((user, idx) => (
                                                <div key={user.id} className="flex items-center justify-between p-4 bg-[#F8F9FA] rounded-2xl border border-transparent hover:border-[#E5E5E5] transition-all">
                                                    <div className="flex items-center gap-4">
                                                        <span className="text-sm font-black text-gray-400 w-6">#{idx + 1}</span>
                                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FFD5C2] to-[#FF6B00] text-white flex items-center justify-center font-black overflow-hidden shadow-sm">
                                                            {user.avatar && user.avatar.startsWith('http') ? (
                                                                <img src={user.avatar} className="w-full h-full object-cover" alt={user.name} />
                                                            ) : (
                                                                (user.name || 'U').charAt(0).toUpperCase()
                                                            )}
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
                                                            <p className="text-sm font-black text-[#1A1A1A]">{user.points || 0}</p>
                                                            <p className="text-[8px] font-black tracking-widest text-gray-400 uppercase mt-0.5">XP</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}

                            </div>
                        </div>
                    )}

                    {/* ================= CONTENT & MCQS TAB ================= */}
                    {activeTab === 'content' && (
                        <div className="space-y-6">

                            {/* View Controls & Filter Bar */}
                            <div className="bg-white border border-[#E5E5E5] rounded-[32px] p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                                {/* Mode Toggle */}
                                <div className="flex items-center gap-2 p-1 bg-[#F8F9FA] border border-[#E5E5E5] rounded-2xl">
                                    <button
                                        onClick={() => setContentViewMode('explorer')}
                                        className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                                            contentViewMode === 'explorer'
                                                ? 'bg-white text-[#FF6B00] shadow-sm border border-gray-100'
                                                : 'text-gray-400 hover:text-[#1A1A1A]'
                                        }`}
                                    >
                                        🔍 Course Explorer
                                    </button>
                                    <button
                                        onClick={() => setContentViewMode('all_courses')}
                                        className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                                            contentViewMode === 'all_courses'
                                                ? 'bg-white text-[#FF6B00] shadow-sm border border-gray-100'
                                                : 'text-gray-400 hover:text-[#1A1A1A]'
                                        }`}
                                    >
                                        📋 All Courses & Topics Summary
                                    </button>
                                </div>

                                {/* Level Filters */}
                                <div className="flex items-center gap-1.5 flex-wrap">
                                    {['ALL', '200L', '300L', 'Other'].map(lvl => (
                                        <button
                                            key={lvl}
                                            onClick={() => setLevelFilter(lvl)}
                                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                                levelFilter === lvl
                                                    ? 'bg-[#1A1A1A] text-white shadow-sm'
                                                    : 'bg-[#F8F9FA] text-gray-500 hover:bg-gray-100 border border-[#E5E5E5]'
                                            }`}
                                        >
                                            {lvl}
                                        </button>
                                    ))}
                                </div>

                                {/* Course Search */}
                                <div className="relative w-full md:w-64">
                                    <input
                                        type="text"
                                        placeholder="Search courses..."
                                        value={courseSearch}
                                        onChange={e => setCourseSearch(e.target.value)}
                                        className="w-full bg-[#F8F9FA] border border-[#E5E5E5] rounded-xl px-4 py-2 text-xs font-bold placeholder-gray-400 focus:outline-none focus:border-[#FF6B00]"
                                    />
                                    {courseSearch && (
                                        <button
                                            onClick={() => setCourseSearch('')}
                                            className="absolute right-3 top-2.5 text-xs text-gray-400 hover:text-gray-600"
                                        >
                                            ✕
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* ================= VIEW MODE 1: EXPLORER ================= */}
                            {contentViewMode === 'explorer' && (
                                <div className="flex flex-col lg:flex-row gap-6">

                                    {/* LEFT COLUMN: COURSES LIST */}
                                    <div className="w-full lg:w-1/3 flex flex-col gap-4">
                                        <div className="bg-white border border-[#E5E5E5] rounded-[32px] p-6 shadow-sm">
                                            <div className="flex justify-between items-center mb-4">
                                                <div>
                                                    <h2 className="text-base font-black text-[#1A1A1A]">Select Course</h2>
                                                    <p className="text-[11px] font-bold text-gray-400">{filteredCourses.length} courses listed</p>
                                                </div>
                                            </div>

                                            <div className="flex flex-col gap-2.5 max-h-[750px] overflow-y-auto pr-1">
                                                {filteredCourses.map(course => {
                                                    const isSelected = selectedCourse?.code === course.code;
                                                    return (
                                                        <button
                                                            key={course.code}
                                                            onClick={() => {
                                                                setSelectedCourse(course);
                                                                setTopicSearch('');
                                                            }}
                                                            className={`text-left p-4 rounded-2xl border transition-all cursor-pointer ${
                                                                isSelected
                                                                    ? 'bg-[#FFF9F5] border-[#FFD5C2] shadow-sm ring-2 ring-[#FF6B00]/20'
                                                                    : 'bg-[#F8F9FA] border-[#E5E5E5] hover:bg-white hover:border-gray-300'
                                                            }`}
                                                        >
                                                            <div className="flex items-center justify-between mb-1.5">
                                                                <span className={`text-xs font-black uppercase tracking-wider ${
                                                                    isSelected ? 'text-[#FF6B00]' : 'text-[#1A1A1A]'
                                                                }`}>
                                                                    {course.code}
                                                                </span>
                                                                <span className="text-[10px] font-bold px-2 py-0.5 bg-white border border-gray-200 rounded-md text-gray-600">
                                                                    {course.level}
                                                                </span>
                                                            </div>
                                                            <p className="font-bold text-xs text-[#1A1A1A] line-clamp-1 mb-2">
                                                                {course.title}
                                                            </p>

                                                            {/* Course Stats Strip */}
                                                            <div className="flex items-center gap-2 flex-wrap text-[10px] font-black">
                                                                <span className="text-gray-500 bg-white/80 px-2 py-0.5 rounded-md border border-gray-100">
                                                                    📑 {course.topicsCount} Topics
                                                                </span>
                                                                <span className={`px-2 py-0.5 rounded-md ${
                                                                    course.totalQuestions > 0
                                                                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                                                        : 'bg-gray-100 text-gray-400'
                                                                }`}>
                                                                    ❓ {course.totalQuestions} MCQs
                                                                </span>
                                                                {course.isAliased && (
                                                                    <span className="bg-orange-50 text-[#FF6B00] px-1.5 py-0.5 rounded-md border border-[#FFD5C2] text-[9px]">
                                                                        🔗 Aliased
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </button>
                                                    );
                                                })}

                                                {filteredCourses.length === 0 && (
                                                    <div className="text-center py-10 text-xs font-bold text-gray-400">
                                                        No courses match your filter.
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* RIGHT COLUMN: SELECTED COURSE TOPICS & PAST QUESTIONS */}
                                    <div className="w-full lg:w-2/3 flex flex-col gap-4">
                                        {selectedCourse ? (
                                            <div className="bg-white border border-[#E5E5E5] rounded-[32px] p-6 shadow-sm min-h-[600px] flex flex-col">
                                                
                                                {/* Course Header Banner */}
                                                <div className="border-b border-gray-100 pb-6 mb-6">
                                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                                                        <div>
                                                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                                <span className="text-xs font-black px-2.5 py-1 bg-[#1A1A1A] text-white rounded-lg uppercase tracking-wider">
                                                                    {selectedCourse.code}
                                                                </span>
                                                                <span className="text-xs font-bold px-2.5 py-1 bg-gray-100 text-gray-700 rounded-lg">
                                                                    {selectedCourse.level}
                                                                </span>
                                                                <span className="text-xs font-bold px-2.5 py-1 bg-gray-100 text-gray-700 rounded-lg">
                                                                    {selectedCourse.semester || '1st Semester'}
                                                                </span>
                                                                {selectedCourse.isAliased && (
                                                                    <span className="text-xs font-bold px-2.5 py-1 bg-[#FFF9F5] text-[#FF6B00] border border-[#FFD5C2] rounded-lg">
                                                                        🔗 Linked DB Code: {getLookupCourseCodes(selectedCourse.code).filter(c => c !== selectedCourse.code).join(', ')}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <h2 className="text-xl md:text-2xl font-black text-[#1A1A1A]">
                                                                {selectedCourse.title}
                                                            </h2>
                                                        </div>
                                                    </div>

                                                    {/* Course Summary Stat Badges */}
                                                    <div className="grid grid-cols-3 gap-3 mt-4">
                                                        <div className="bg-[#F8F9FA] border border-[#E5E5E5] rounded-2xl p-3 text-center">
                                                            <p className="text-lg font-black text-[#1A1A1A]">{selectedCourse.topicsCount}</p>
                                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Total Topics</p>
                                                        </div>
                                                        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-3 text-center">
                                                            <p className="text-lg font-black text-emerald-700">{selectedCourse.totalQuestions}</p>
                                                            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-wider">Past Questions (MCQs)</p>
                                                        </div>
                                                        <div className="bg-purple-50 border border-purple-100 rounded-2xl p-3 text-center">
                                                            <p className="text-lg font-black text-purple-700">{selectedCourse.totalReadings}</p>
                                                            <p className="text-[10px] font-black text-purple-600 uppercase tracking-wider">Study Notes</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Topics Search Bar */}
                                                <div className="flex items-center justify-between gap-4 mb-4">
                                                    <div>
                                                        <h3 className="text-sm font-black text-[#1A1A1A] uppercase tracking-wider">
                                                            Course Topics & Questions Breakdown
                                                        </h3>
                                                        <p className="text-xs text-gray-400">
                                                            Showing {selectedCourseFilteredTopics.length} of {selectedCourse.topicsCount} topics
                                                        </p>
                                                    </div>
                                                    <div className="w-56">
                                                        <input
                                                            type="text"
                                                            placeholder="Filter topics..."
                                                            value={topicSearch}
                                                            onChange={e => setTopicSearch(e.target.value)}
                                                            className="w-full bg-[#F8F9FA] border border-[#E5E5E5] rounded-xl px-3 py-1.5 text-xs font-bold placeholder-gray-400 focus:outline-none focus:border-[#FF6B00]"
                                                        />
                                                    </div>
                                                </div>

                                                {/* Topics List with exact questions count per topic */}
                                                <div className="space-y-3 flex-1 overflow-y-auto">
                                                    {selectedCourseFilteredTopics.map((topic, idx) => (
                                                        <div
                                                            key={topic.name}
                                                            className="p-4 bg-[#F8F9FA] border border-[#E5E5E5] rounded-2xl hover:border-gray-300 hover:bg-white transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                                                        >
                                                            <div className="flex items-start gap-3">
                                                                <span className="w-7 h-7 rounded-xl bg-white border border-gray-200 text-gray-500 flex items-center justify-center text-xs font-black shrink-0 mt-0.5">
                                                                    {idx + 1}
                                                                </span>
                                                                <div>
                                                                    <h4 className="text-xs font-black text-[#1A1A1A] leading-snug">
                                                                        {topic.name}
                                                                    </h4>
                                                                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                                                                        {/* PROMINENT PAST QUESTIONS BADGE */}
                                                                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-black ${
                                                                            topic.questionsCount > 0
                                                                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                                                : 'bg-gray-100 text-gray-400 border border-gray-200'
                                                                        }`}>
                                                                            <span>❓</span> {topic.questionsCount} Past Questions
                                                                        </span>

                                                                        {/* READINGS BADGE */}
                                                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-black bg-purple-50 text-purple-700 border border-purple-200">
                                                                            <span>📖</span> {topic.readingsCount} Readings
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                                                                <button
                                                                    onClick={() => openTopicInspector(topic.name, selectedCourse)}
                                                                    className="px-3.5 py-2 bg-white border border-[#E5E5E5] text-[#1A1A1A] hover:border-[#FF6B00] hover:text-[#FF6B00] rounded-[14px] text-xs font-black shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                                                                >
                                                                    <span>Inspect Content</span>
                                                                    <span>→</span>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}

                                                    {selectedCourseFilteredTopics.length === 0 && (
                                                        <div className="p-8 text-center bg-[#F8F9FA] rounded-2xl border border-dashed border-gray-200">
                                                            <p className="text-xs font-bold text-gray-400">
                                                                {selectedCourse.topicsCount === 0
                                                                    ? 'No topics or questions recorded for this course yet.'
                                                                    : 'No topics match your search query.'}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>

                                            </div>
                                        ) : (
                                            <div className="bg-[#F8F9FA] border border-dashed border-[#E5E5E5] rounded-[32px] h-[500px] flex flex-col items-center justify-center text-center p-8">
                                                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-3xl mb-4 shadow-sm border border-gray-100">👈</div>
                                                <h3 className="text-lg font-black text-[#1A1A1A] mb-1">Select a Course</h3>
                                                <p className="text-sm font-medium text-gray-500 max-w-xs">
                                                    Click any course on the left to view its topics and the exact count of past questions per topic.
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                </div>
                            )}

                            {/* ================= VIEW MODE 2: ALL COURSES SUMMARY ================= */}
                            {contentViewMode === 'all_courses' && (
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between px-2">
                                        <div>
                                            <h2 className="text-lg font-black text-[#1A1A1A]">Curriculum & Questions Matrix</h2>
                                            <p className="text-xs text-gray-400 font-medium">
                                                Displaying all courses with every topic and its exact number of past questions
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={expandAllCourses}
                                                className="px-3 py-1.5 bg-white border border-[#E5E5E5] rounded-[14px] text-xs font-bold hover:border-gray-400 transition-colors cursor-pointer"
                                            >
                                                Expand All
                                            </button>
                                            <button
                                                onClick={collapseAllCourses}
                                                className="px-3 py-1.5 bg-white border border-[#E5E5E5] rounded-[14px] text-xs font-bold hover:border-gray-400 transition-colors cursor-pointer"
                                            >
                                                Collapse All
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        {filteredCourses.map(course => {
                                            const isExpanded = !!expandedCourseCodes[course.code];
                                            return (
                                                <div
                                                    key={course.code}
                                                    className="bg-white border border-[#E5E5E5] rounded-[28px] overflow-hidden shadow-sm transition-all"
                                                >
                                                    {/* Course Header Bar (Clickable) */}
                                                    <div
                                                        onClick={() => toggleCourseExpand(course.code)}
                                                        className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-gray-50/70 transition-colors"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-sm font-black px-3 py-1 bg-[#1A1A1A] text-white rounded-xl">
                                                                {course.code}
                                                            </span>
                                                            <div>
                                                                <h3 className="text-sm font-black text-[#1A1A1A]">
                                                                    {course.title}
                                                                </h3>
                                                                <p className="text-[10px] font-bold text-gray-400 mt-0.5">
                                                                    {course.level} • {course.department || 'Law'} {course.isAliased ? '• Aliased in DB' : ''}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center gap-3">
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-xs font-black px-2.5 py-1 bg-[#F8F9FA] border border-[#E5E5E5] rounded-lg text-gray-700">
                                                                    📑 {course.topicsCount} Topics
                                                                </span>
                                                                <span className={`text-xs font-black px-2.5 py-1 rounded-lg ${
                                                                    course.totalQuestions > 0
                                                                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                                        : 'bg-gray-100 text-gray-400 border border-gray-200'
                                                                }`}>
                                                                    ❓ {course.totalQuestions} Questions
                                                                </span>
                                                            </div>
                                                            <span className="text-sm font-black text-gray-400 w-6 text-center">
                                                                {isExpanded ? '▲' : '▼'}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Expanded Topics Table */}
                                                    {isExpanded && (
                                                        <div className="border-t border-gray-100 bg-[#F8F9FA] p-5">
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                                {course.topics.map((topic, tIdx) => (
                                                                    <div
                                                                        key={topic.name}
                                                                        className="p-3.5 bg-white border border-[#E5E5E5] rounded-xl flex items-center justify-between gap-3 shadow-xs"
                                                                    >
                                                                        <div className="flex items-start gap-2.5">
                                                                            <span className="text-[10px] font-black text-gray-400 w-5 mt-0.5">
                                                                                #{tIdx + 1}
                                                                            </span>
                                                                            <div>
                                                                                <p className="text-xs font-bold text-[#1A1A1A] line-clamp-1">
                                                                                    {topic.name}
                                                                                </p>
                                                                                <p className="text-[10px] text-gray-400 font-bold mt-0.5">
                                                                                    📖 {topic.readingsCount} Readings
                                                                                </p>
                                                                            </div>
                                                                        </div>

                                                                        <div className="flex items-center gap-2 shrink-0">
                                                                            <span className={`text-xs font-black px-2.5 py-1 rounded-lg ${
                                                                                topic.questionsCount > 0
                                                                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                                                    : 'bg-gray-100 text-gray-400'
                                                                            }`}>
                                                                                ❓ {topic.questionsCount}
                                                                            </span>
                                                                            <button
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation();
                                                                                    openTopicInspector(topic.name, course);
                                                                                }}
                                                                                className="px-2.5 py-1 bg-[#FFF9F5] border border-[#FFD5C2] text-[#FF6B00] rounded-[14px] text-[10px] font-black hover:bg-[#FF6B00] hover:text-white transition-colors cursor-pointer"
                                                                            >
                                                                                View
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                ))}

                                                                {course.topics.length === 0 && (
                                                                    <div className="col-span-2 text-center py-6 text-xs font-bold text-gray-400">
                                                                        No topics found under this course.
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                        </div>
                    )}
                </>
            )}

            {/* ================= TOPIC CONTENT INSPECTOR MODAL / DRAWER ================= */}
            {inspectingTopic && inspectingCourse && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white border border-[#E5E5E5] rounded-[32px] w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-fade-in">
                        
                        {/* Modal Header */}
                        <div className="p-6 border-b border-gray-100 flex items-start justify-between gap-4">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xs font-black px-2.5 py-0.5 bg-[#FF6B00] text-white rounded-md">
                                        {inspectingCourse.code}
                                    </span>
                                    <span className="text-xs font-bold text-gray-500">
                                        {inspectingCourse.title}
                                    </span>
                                </div>
                                <h2 className="text-lg md:text-xl font-black text-[#1A1A1A]">
                                    {inspectingTopic}
                                </h2>
                            </div>
                            <button
                                onClick={closeTopicInspector}
                                className="w-9 h-9 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 flex items-center justify-center font-black text-sm cursor-pointer"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Modal Tabs */}
                        <div className="flex border-b border-gray-100 px-6 bg-[#F8F9FA]">
                            <button
                                onClick={() => setInspectorTab('questions')}
                                className={`py-3 px-4 text-xs font-black uppercase tracking-wider border-b-2 cursor-pointer transition-all ${
                                    inspectorTab === 'questions'
                                        ? 'border-[#FF6B00] text-[#FF6B00] bg-white'
                                        : 'border-transparent text-gray-400 hover:text-gray-700'
                                }`}
                            >
                                ❓ Past Questions ({topicQuestions.length})
                            </button>
                            <button
                                onClick={() => setInspectorTab('readings')}
                                className={`py-3 px-4 text-xs font-black uppercase tracking-wider border-b-2 cursor-pointer transition-all ${
                                    inspectorTab === 'readings'
                                        ? 'border-[#FF6B00] text-[#FF6B00] bg-white'
                                        : 'border-transparent text-gray-400 hover:text-gray-700'
                                }`}
                            >
                                📖 Readings ({inspectedTopicReadings.length})
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 overflow-y-auto flex-1 space-y-4">

                            {/* QUESTIONS TAB */}
                            {inspectorTab === 'questions' && (
                                <>
                                    {isLoadingTopicQuestions ? (
                                        <div className="text-center py-12">
                                            <div className="w-8 h-8 border-3 border-[#FF6B00] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                                            <p className="text-xs font-bold text-gray-400">Loading topic questions...</p>
                                        </div>
                                    ) : topicQuestions.length > 0 ? (
                                        <div className="space-y-4">
                                            {topicQuestions.map((q, idx) => (
                                                <div
                                                    key={idx}
                                                    className="p-5 bg-[#F8F9FA] border border-[#E5E5E5] rounded-2xl shadow-xs"
                                                >
                                                    <div className="flex items-start justify-between gap-3 mb-2">
                                                        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 bg-gray-200 text-gray-700 rounded-md">
                                                            Question #{idx + 1}
                                                        </span>
                                                        {q.case_citation && (
                                                            <span className="text-[10px] font-bold text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-md">
                                                                ⚖️ {q.case_citation}
                                                            </span>
                                                        )}
                                                    </div>

                                                    <p className="text-sm font-bold text-[#1A1A1A] mb-4 leading-relaxed">
                                                        {q.question_text}
                                                    </p>

                                                    {/* Options Grid */}
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                                                        {q.options && q.options.map((opt, oIdx) => {
                                                            const isCorrect = oIdx === q.correct_option_index;
                                                            return (
                                                                <div
                                                                    key={oIdx}
                                                                    className={`p-2.5 rounded-xl text-xs font-bold border flex items-start gap-2 ${
                                                                        isCorrect
                                                                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300 ring-1 ring-emerald-300'
                                                                            : 'bg-white text-gray-700 border-gray-200'
                                                                    }`}
                                                                >
                                                                    <span className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-black shrink-0 ${
                                                                        isCorrect ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-600'
                                                                    }`}>
                                                                        {['A', 'B', 'C', 'D'][oIdx]}
                                                                    </span>
                                                                    <span className="flex-1">{opt}</span>
                                                                    {isCorrect && <span className="text-emerald-600 font-black">✓</span>}
                                                                </div>
                                                            );
                                                        })}
                                                    </div>

                                                    {/* Explanation if present */}
                                                    {q.explanation && (
                                                        <div className="p-3 bg-white border border-gray-200 rounded-xl text-xs text-gray-600">
                                                            <span className="font-black text-[#1A1A1A]">💡 Explanation: </span>
                                                            {q.explanation}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-12 text-xs font-bold text-gray-400">
                                            No past questions found for this topic.
                                        </div>
                                    )}
                                </>
                            )}

                            {/* READINGS TAB */}
                            {inspectorTab === 'readings' && (
                                <div className="space-y-4">
                                    {inspectedTopicReadings.length > 0 ? (
                                        inspectedTopicReadings.map((r, idx) => (
                                            <div
                                                key={idx}
                                                className="p-5 bg-[#F8F9FA] border border-[#E5E5E5] rounded-2xl shadow-xs"
                                            >
                                                <div className="flex items-center justify-between mb-2">
                                                    <h4 className="text-xs font-black text-[#1A1A1A]">
                                                        {r.subtopic || `Section ${idx + 1}`}
                                                    </h4>
                                                    <span className="text-[10px] font-bold text-gray-400">
                                                        Module Reading
                                                    </span>
                                                </div>
                                                <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-line">
                                                    {r.content_body}
                                                </p>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-12 text-xs font-bold text-gray-400">
                                            No module readings found for this topic.
                                        </div>
                                    )}
                                </div>
                            )}

                        </div>

                        {/* Modal Footer */}
                        <div className="p-4 border-t border-gray-100 bg-[#F8F9FA] flex justify-end">
                            <button
                                onClick={closeTopicInspector}
                                className="px-5 py-2 bg-[#1A1A1A] text-white rounded-[14px] text-xs font-bold hover:bg-black transition-colors cursor-pointer"
                            >
                                Close Inspector
                            </button>
                        </div>

                    </div>
                </div>
            )}

        </div>
    );
}