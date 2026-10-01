// src/pages/CourseLibrary.jsx
export default function CourseLibrary({ courses, openCourseTopics, getCourseMastery }) {
    return (
        <div>
            {/* 🚀 Standardized Header (Matches Dashboard) */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
                <div>
                    <h1 className="text-2xl md:text-4xl font-black tracking-tight text-[#1A1A1A] dark:text-white mb-1">
                        Course Library
                    </h1>
                    <p className="text-xs md:text-sm font-medium text-gray-500 dark:text-gray-400">
                        Master your syllabus topic by topic with curated resources.
                    </p>
                </div>
                <div className="px-4 py-2 bg-[#F8F9FA] dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-gray-800 text-[#1A1A1A] dark:text-white rounded-2xl text-xs font-bold shadow-sm mb-1 md:mb-0">
                    📚 {courses.filter(c => c.is_available).length} Enrolled Courses
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => {
                    const isAvailable = course.is_available;
                    const mastery = getCourseMastery(course.code, course.topics_count);

                    return (
                        <div key={course.id} className={`bg-[#F8F9FA] dark:bg-[#1A1A1A] rounded-3xl p-6 border flex flex-col justify-between transition-all ${isAvailable ? 'border-[#E5E5E5] dark:border-gray-800 hover:shadow-md' : 'border-gray-100 dark:border-gray-800/50 opacity-60'}`}>
                            <div>
                                <div className="flex justify-between items-center mb-3">
                                    <span className="text-xs font-extrabold text-[#666666] dark:text-gray-400 uppercase tracking-wider">{course.code}</span>
                                    {/* Updated from {course.units} UNITS to uniformly 4 UNITS */}
                                    <span className="text-xs font-bold text-[#666666] dark:text-gray-400">4 UNITS</span>
                                </div>
                                <h3 className="text-lg font-bold mb-3 text-[#1A1A1A] dark:text-white">{course.title}</h3>
                                <div className="flex items-center gap-4 text-xs font-semibold text-[#666666] dark:text-gray-400 mb-4">
                                    <span>📖 {course.topics_count} Topics</span>
                                </div>

                                {isAvailable && (
                                    <div className="mb-6">
                                        <div className="flex justify-between text-xs font-bold mb-1.5">
                                            <span className="text-[#666666] dark:text-gray-400">MASTERY</span>
                                            <span className="text-[#FF6B00]">{mastery}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 dark:bg-gray-800 h-2 rounded-full overflow-hidden">
                                            <div className="bg-[#FF6B00] h-full rounded-full transition-all duration-500" style={{ width: `${mastery}%` }}></div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className={!isAvailable ? 'mt-8' : ''}>
                                <p className="text-xs text-[#666666] dark:text-gray-400 mb-4 font-medium">Last Studied: {isAvailable ? course.last_studied : 'Not started'}</p>
                                <button
                                    onClick={() => isAvailable && openCourseTopics(course)}
                                    disabled={!isAvailable}
                                    className={`w-full py-3.5 text-sm font-bold rounded-2xl transition-all shadow-sm flex items-center justify-center gap-2 ${isAvailable
                                        ? 'bg-white dark:bg-[#242424] border border-[#E5E5E5] dark:border-gray-700 hover:border-[#FF6B00] dark:hover:border-[#FF6B00] text-[#1A1A1A] dark:text-white'
                                        : 'bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                                        }`}
                                >
                                    {isAvailable ? 'View Topics & Curriculum →' : '🔒 Not Yet Available'}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}