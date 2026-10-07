// src/pages/ManageCourses.jsx
import { useState, useEffect, useMemo, useCallback } from 'react';
import { supabase } from '../supabase';

export default function ManageCourses({ allCourses = [], enrolledCourses = [], setEnrolledCourses, level, department, currentUserDbId, goBack, currentSemester = '1st Semester' }) {

    const [activeSemester, setActiveSemester] = useState(currentSemester);
    const [selectedCourseCodes, setSelectedCourseCodes] = useState([...enrolledCourses]);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeLevel, setActiveLevel] = useState(level);
    const [isSaving, setIsSaving] = useState(false);

    const parseLevelNum = (lvl) => {
        if (!lvl) return 0;
        const m = String(lvl).match(/\d+/);
        return m ? parseInt(m[0], 10) : 0;
    };

    const userLevelNum = useMemo(() => parseLevelNum(level), [level]);

    // Available level pills: Only show up to student's current level + Special
    const availableLevels = useMemo(() => {
        const lvls = [];
        ['100L', '200L', '300L', '400L', '500L'].forEach(l => {
            if (parseLevelNum(l) <= userLevelNum) {
                lvls.push(l);
            }
        });
        return ['All', ...lvls, 'Special'];
    }, [userLevelNum]);

    const isCourseLocked = useCallback((course) => {
        return course.type === 'Main' && course.level === level && (course.department === department || course.department === 'Law');
    }, [level, department]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSelectedCourseCodes(prev => {
            const lockedMainCourses = allCourses
                .filter(c => isCourseLocked(c))
                .map(c => c.code);

            const combined = Array.from(new Set([...prev, ...enrolledCourses, ...lockedMainCourses]));
            if (combined.length !== prev.length) {
                return combined;
            }
            return prev;
        });
    }, [enrolledCourses, allCourses, isCourseLocked]);

    const toggleCourse = (course) => {
        if (isCourseLocked(course)) return;

        setSelectedCourseCodes(prev =>
            prev.includes(course.code)
                ? prev.filter(c => c !== course.code)
                : [...prev, course.code]
        );
    };

    const selectedCoursesData = selectedCourseCodes
        .map(code => allCourses.find(c => c.code === code))
        .filter(Boolean)
        .filter(c => c.semester === activeSemester);

    const coreSelectedCount = selectedCoursesData.filter(c => c.type === 'Core Elective').length;
    const restrictedSelectedCount = selectedCoursesData.filter(c => c.type === 'Restricted Elective').length;

    const filteredCourses = useMemo(() => {
        const visible = allCourses.filter(course => {
            if (isCourseLocked(course)) return false;

            const courseLevelNum = parseLevelNum(course.level);

            // 1. Electives (Core and Restricted) must ONLY be for the student's current level!
            // A 200L student can NEVER take 300L electives.
            if (course.type === 'Core Elective' || course.type === 'Restricted Elective') {
                if (courseLevelNum > 0 && userLevelNum > 0 && courseLevelNum !== userLevelNum) {
                    return false;
                }
            }

            // 2. Carryovers (Main courses): Can ONLY be from strictly LOWER levels!
            // A 300L carryover is NOT possible in 200L!
            if (course.type === 'Main') {
                if (userLevelNum > 0 && (courseLevelNum >= userLevelNum || courseLevelNum === 0)) {
                    return false;
                }
            }

            // Special electives shouldn't be seen by students of the originating department
            if (course.type === 'Special Elective' && (course.department === department || course.department === 'Law')) return false;

            const isOwnDept = (course.department === department || course.department === 'Law');

            // Non-own-dept courses should only be visible if they are NOT Main courses
            if (course.type === 'Main' && !isOwnDept) return false;
            if (course.semester !== activeSemester) return false;

            // Pill filter
            if (activeLevel === 'Special' && course.type !== 'Special Elective') return false;
            if (activeLevel !== 'All' && activeLevel !== 'Special' && course.level !== activeLevel && course.level !== 'Any') return false;

            if (searchQuery && !course.title.toLowerCase().includes(searchQuery.toLowerCase()) && !course.code.toLowerCase().includes(searchQuery.toLowerCase())) {
                return false;
            }

            return true;
        });

        return visible.sort((a, b) => {
            const typeWeight = { 'Core Elective': 1, 'Restricted Elective': 2, 'Special Elective': 3, 'Main': 4 };
            if (typeWeight[a.type] !== typeWeight[b.type]) {
                return typeWeight[a.type] - typeWeight[b.type];
            }
            return a.code.localeCompare(b.code);
        });
    }, [allCourses, department, activeLevel, activeSemester, searchQuery, isCourseLocked, userLevelNum]);

    const groupedCourses = {
        'Core Electives': filteredCourses.filter(c => c.type === 'Core Elective'),
        'Restricted Electives': filteredCourses.filter(c => c.type === 'Restricted Elective'),
        'Special Electives': filteredCourses.filter(c => c.type === 'Special Elective'),
        'Carryovers': filteredCourses.filter(c => c.type === 'Main')
    };

    const handleSave = async () => {
        setIsSaving(true);
        setEnrolledCourses(selectedCourseCodes);
        if (currentUserDbId) {
            const { error } = await supabase.from('profiles').update({ enrolled_courses: selectedCourseCodes }).eq('id', currentUserDbId);
            if (error) console.error('Error saving courses:', error);
        }
        setIsSaving(false);
        goBack();
    };

    return (
        <div className="w-full max-w-2xl mx-auto pt-6 px-4 pb-44 font-sans animate-fade-in relative min-h-screen">

            <div className="mb-6">
                <h1 className="text-[32px] font-black text-[#111827] dark:text-white tracking-tight leading-none mb-2">
                    Manage Courses
                </h1>
                <p className="text-[14px] font-medium text-gray-400 dark:text-gray-500 leading-relaxed">
                    Customize your {level} {department} study plan. Compulsory main courses are automatically added and locked.
                </p>
            </div>

            <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                    <span className="text-[11px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500">Selected ({activeSemester})</span>
                    <span className="text-[11px] font-bold text-[#FF6B00] bg-[#FFF5F0] dark:bg-[#FF6B00]/10 px-3 py-1.5 rounded-full">
                        {selectedCoursesData.length} Selected
                    </span>
                </div>

                {selectedCoursesData.length > 0 ? (
                    <div className="flex flex-wrap gap-2.5">
                        {selectedCoursesData.map(course => {
                            const locked = isCourseLocked(course);
                            return (
                                <div
                                    key={course.id}
                                    onClick={() => toggleCourse(course)}
                                    className={`px-4 py-2 rounded-full text-[13px] font-bold flex items-center gap-2 transition-all ${!locked ? 'cursor-pointer' : ''} ${locked
                                        ? 'bg-transparent border border-dashed border-[#E5E5E5] dark:border-gray-800 text-gray-400'
                                        : 'bg-white dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-gray-800 text-[#111827] dark:text-white hover:border-[#FFD5C2] dark:hover:border-[#FF6B00]/50 shadow-sm'
                                        }`}
                                >
                                    {course.code}
                                    {locked ? (
                                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
                                    ) : (
                                        <div className="w-4 h-4 bg-[#F3F4F6] dark:bg-gray-800 rounded-full flex items-center justify-center hover:bg-red-50 dark:hover:bg-red-900/30">
                                            <svg className="w-2.5 h-2.5 text-gray-400 hover:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="py-4 text-sm text-gray-400 font-medium">No courses selected for {activeSemester}.</div>
                )}
            </div>

            <div className="space-y-5 mb-10">
                <div className="relative flex bg-[#F8F9FA] dark:bg-[#1A1A1A] p-1 rounded-full border border-[#E5E5E5] dark:border-gray-800 w-[240px] transition-colors shadow-sm mb-4">
                    <div
                        className="absolute top-1 bottom-1 w-[115px] bg-white dark:bg-gray-800 rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.08)] transition-transform duration-300 ease-out"
                        style={{ transform: activeSemester === '2nd Semester' ? 'translateX(117px)' : 'translateX(0)' }}
                    ></div>
                    <button
                        onClick={() => setActiveSemester('1st Semester')}
                        className={`flex-1 relative z-10 py-2 text-xs font-bold rounded-full transition-colors ${activeSemester === '1st Semester'
                            ? 'text-[#111827] dark:text-white'
                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white'
                            }`}
                    >
                        1st Semester
                    </button>
                    <button
                        onClick={() => setActiveSemester('2nd Semester')}
                        className={`flex-1 relative z-10 py-2 text-xs font-bold rounded-full transition-colors ${activeSemester === '2nd Semester'
                            ? 'text-[#111827] dark:text-white'
                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white'
                            }`}
                    >
                        2nd Semester
                    </button>
                </div>

                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <svg className="h-4 w-4 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </div>
                    <input
                        type="text"
                        placeholder="Search by name or code..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-white dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-gray-800 rounded-[16px] text-sm font-medium text-[#111827] dark:text-white focus:outline-none focus:border-[#FF6B00] transition-colors shadow-sm"
                    />
                </div>

                <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 -mx-4 px-4 md:px-0 md:mx-0">
                    {availableLevels.map(lvl => (
                        <button
                            key={lvl}
                            onClick={() => setActiveLevel(lvl)}
                            className={`shrink-0 px-5 py-2.5 rounded-[12px] text-[13px] font-bold transition-all shadow-sm ${activeLevel === lvl
                                ? 'bg-[#111827] dark:bg-white text-white dark:text-[#111827]'
                                : 'bg-white dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-gray-800 text-gray-500 hover:text-[#111827] dark:hover:text-white'
                                }`}
                        >
                            {lvl}
                        </button>
                    ))}
                </div>
            </div>

            <div>
                {Object.entries(groupedCourses).map(([groupTitle, courses]) => {
                    if (courses.length === 0) return null;

                    return (
                        <div key={groupTitle} className="mb-10">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-[11px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500">{groupTitle}</span>
                                {groupTitle === 'Core Electives' && <span className="text-[9px] font-black text-[#FF6B00] bg-[#FFF5F0] dark:bg-[#FF6B00]/10 px-2 py-1 rounded-full uppercase tracking-wider border border-[#FFD5C2] dark:border-[#FF6B00]/20">SELECT MAX 1</span>}
                                {groupTitle === 'Restricted Electives' && <span className="text-[9px] font-black text-[#3B82F6] bg-[#F0F4FF] dark:bg-blue-900/20 px-2 py-1 rounded-full uppercase tracking-wider border border-blue-200 dark:border-blue-900/30">SELECT MAX 1</span>}
                            </div>

                            <div className="space-y-4">
                                {courses.map((course) => {
                                    const isSelected = selectedCourseCodes.includes(course.code);
                                    let isDisabled = false;

                                    if (!isSelected) {
                                        if (course.type === 'Core Elective' && coreSelectedCount >= 1) isDisabled = true;
                                        if (course.type === 'Restricted Elective' && restrictedSelectedCount >= 1) isDisabled = true;
                                    }

                                    return (
                                        <div key={course.id} className={`bg-white dark:bg-[#1A1A1A] rounded-[24px] p-5 border ${isSelected ? 'border-[#FFD5C2] dark:border-[#FF6B00]/40' : 'border-[#E5E5E5] dark:border-gray-800'} shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex justify-between items-center transition-all ${isDisabled ? 'opacity-50 grayscale-[50%]' : ''}`}>

                                            <div className="flex flex-col gap-2.5">
                                                <div className="flex gap-2 mb-0.5">
                                                    <span className={`px-2.5 py-1 rounded-[6px] text-[10px] font-black uppercase tracking-wider bg-[#F3F4F6] dark:bg-gray-800 text-gray-500 dark:text-gray-400`}>
                                                        {course.code}
                                                    </span>
                                                    {course.type === 'Core Elective' && (
                                                        <span className="px-2.5 py-1 rounded-[6px] text-[10px] font-black uppercase tracking-wider bg-[#FFF5F0] dark:bg-[#FF6B00]/10 text-[#FF6B00]">
                                                            CORE ELECTIVE
                                                        </span>
                                                    )}
                                                    {course.type === 'Restricted Elective' && (
                                                        <span className="px-2.5 py-1 rounded-[6px] text-[10px] font-black uppercase tracking-wider bg-[#F0F4FF] dark:bg-blue-900/20 text-[#3B82F6]">
                                                            RESTRICTED
                                                        </span>
                                                    )}
                                                    {course.type === 'Special Elective' && (
                                                        <span className="px-2.5 py-1 rounded-[6px] text-[10px] font-black uppercase tracking-wider bg-[#F0FDF4] dark:bg-green-900/20 text-[#22C55E]">
                                                            SPECIAL
                                                        </span>
                                                    )}
                                                    {course.type === 'Main' && (
                                                        <span className="px-2.5 py-1 rounded-[6px] text-[10px] font-black uppercase tracking-wider bg-[#F9FAFB] dark:bg-gray-800 text-gray-500">
                                                            CARRYOVER
                                                        </span>
                                                    )}
                                                </div>

                                                <h3 className="text-[16px] font-bold text-[#111827] dark:text-white leading-tight">
                                                    {course.title}
                                                </h3>

                                                <div className="flex items-center gap-4 text-xs font-bold text-gray-500 dark:text-gray-400 mt-1">
                                                    <span className="flex items-center gap-1.5">
                                                        <div className="w-4 h-4 rounded-full bg-[#FFF5F0] dark:bg-[#FF6B00]/10 flex items-center justify-center shrink-0">
                                                            <svg className="w-2.5 h-2.5 text-[#FF6B00]" viewBox="0 0 24 24" fill="currentColor"><path d="M4 8l8-4 8 4-8 4-8-4zm0 4l8 4 8-4m-16 4l8 4 8-4" /></svg>
                                                        </div>
                                                        {course.topics_count} Topics
                                                    </span>
                                                    <span className="flex items-center gap-1.5 opacity-60">
                                                        • {course.level}
                                                    </span>
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => !isDisabled && toggleCourse(course)}
                                                disabled={isDisabled}
                                                className={`w-[44px] h-[44px] rounded-[14px] flex items-center justify-center shrink-0 transition-all ${isDisabled
                                                    ? 'bg-[#F9FAFB] dark:bg-gray-800 text-gray-300 dark:text-gray-600 cursor-not-allowed'
                                                    : isSelected
                                                        ? 'bg-[#111827] dark:bg-white text-white dark:text-[#111827] shadow-md hover:scale-95'
                                                        : 'bg-[#F8F9FA] dark:bg-gray-800 text-[#111827] dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 active:scale-95'
                                                    }`}
                                            >
                                                {isDisabled ? (
                                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
                                                ) : isSelected ? (
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg>
                                                ) : (
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"></path></svg>
                                                )}
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}

                {filteredCourses.length === 0 && (
                    <div className="text-center py-12 px-4 bg-white dark:bg-[#1A1A1A] rounded-[24px] border border-dashed border-[#E5E5E5] dark:border-gray-800">
                        <span className="text-3xl mb-3 block">🔍</span>
                        <h4 className="text-sm font-bold text-gray-800 dark:text-white mb-1">No courses found</h4>
                        <p className="text-xs text-gray-400 font-medium">Try adjusting your filters or search query.</p>
                    </div>
                )}
            </div>

            <div className="fixed bottom-[92px] md:bottom-8 left-0 right-0 z-50 pointer-events-none px-4 flex justify-center pb-safe">
                <div className="bg-white/95 dark:bg-[#1A1A1A]/95 backdrop-blur-md rounded-[20px] shadow-[0_8px_40px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_40px_rgba(0,0,0,0.4)] p-2 pl-6 flex justify-between items-center w-full max-w-[420px] pointer-events-auto border border-[#E5E5E5] dark:border-gray-800 transition-all">
                    <div>
                        <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 block mb-0.5">Enrolling</span>
                        <span className="text-[13px] font-black text-[#111827] dark:text-white">{selectedCoursesData.length} Courses Total</span>
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="bg-[#FF6B00] text-white px-6 py-3 rounded-[16px] text-[13px] font-bold shadow-[0_4px_14px_rgba(255,107,0,0.25)] hover:bg-[#E05D00] active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                        {isSaving ? (
                            <>
                                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                Saving
                            </>
                        ) : 'Save Plan'}
                    </button>
                </div>
            </div>
        </div>
    );
}