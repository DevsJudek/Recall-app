// src/pages/Quiz.jsx
import { useSound } from '../contexts/SoundContext';

export default function Quiz({
    activeCourse,
    courses,
    questions,
    currentIndex,
    timeLeft,
    selectedOption,
    isLocked,
    handleSelect,
    handleLockAnswer,
    handleNextQuestion,
    practiceMode
}) {
    const { playSound } = useSound(); // 🚀 GRAB PLAY FUNCTION FROM CONTEXT

    const question = questions[currentIndex];
    if (!question) return null;

    const rawTopicName = question.topic || "Topic Name";
    const topicMatch = rawTopicName.match(/^(\d+)\s+(.*)$/);
    const topicNum = topicMatch ? topicMatch[1] : "";
    const topicTitle = topicMatch ? topicMatch[2] : rawTopicName;

    const courseCode = question.course_code || activeCourse?.code || "MIXED";
    const matchedCourse = courses?.find(c => c.code === courseCode);
    const courseTitle = activeCourse?.title || matchedCourse?.title || "Course Name";

    const totalQuestions = questions.length || 10;
    const currentQNum = String(currentIndex + 1).padStart(2, '0');

    const correctIndex = question.correct_option_index;
    const isCorrect = selectedOption === correctIndex;
    const isTimeElapsed = isLocked && selectedOption === null && practiceMode === 'ranked';
    const timerPercentage = Math.max(0, (timeLeft / 15) * 100);
    const getLetter = (index) => ['A', 'B', 'C', 'D'][index];

    return (
        <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#0a0a0a] flex flex-col font-sans transition-colors relative">
            
            {/* STICKY HEADER PART */}
            <div className="sticky top-0 z-40 bg-[#F8F9FA]/95 dark:bg-[#0a0a0a]/95 backdrop-blur-md px-6 pt-4 pb-4 border-b border-[#E5E5E5] dark:border-gray-800 shadow-sm">
                <div className="max-w-4xl mx-auto w-full space-y-4">
                    {practiceMode === 'ranked' && (
                        <div>
                            <div className="flex justify-between items-end mb-2">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Time Remaining</span>
                                <span className={`text-xs font-black ${timeLeft <= 5 ? 'text-rose-500' : 'text-[#1A1A1A] dark:text-white'}`}>00:{String(timeLeft).padStart(2, '0')}s</span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-800 h-1.5 rounded-full overflow-hidden">
                                <div
                                    className={`h-full transition-all duration-1000 ease-linear rounded-full ${timeLeft <= 5 ? 'bg-rose-500' : 'bg-[#FF6B00]'}`}
                                    style={{ width: `${timerPercentage}%` }}
                                ></div>
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-2">
                            <span className="px-2.5 py-1 bg-[#FFF2EC] dark:bg-orange-950/30 text-[#FF6B00] text-[10px] font-black uppercase tracking-widest rounded-md border border-[#FFD5C2] dark:border-orange-900/50">
                                {courseCode}
                            </span>
                            <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                {courseTitle}
                            </span>
                        </div>

                        <div className="flex justify-between items-center">
                            <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-[9px] font-black uppercase tracking-widest rounded-md border border-gray-200 dark:border-gray-700 line-clamp-1 max-w-[65%] flex items-center gap-1.5">
                                {topicNum && <span className="text-[#FF6B00]">{topicNum}</span>}
                                <span>{topicTitle}</span>
                            </span>
                            <span className="text-xs font-extrabold text-[#1A1A1A] dark:text-white shrink-0">
                                Question {currentQNum} <span className="text-gray-400 dark:text-gray-500 font-medium">of {totalQuestions}</span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto">
                <div className="max-w-4xl mx-auto px-6 py-8 pb-32 space-y-4">
                    
                    <div className="bg-white dark:bg-[#1A1A1A] rounded-[32px] p-8 md:p-10 shadow-sm border border-[#E5E5E5] dark:border-gray-800 mb-6 transition-colors">
                        <h2 className="text-2xl md:text-3xl font-black text-[#1A1A1A] dark:text-white leading-snug">
                            {question.question_text}
                        </h2>
                    </div>

                    <div className="space-y-3">
                        {question.options.map((opt, index) => {
                            const letter = getLetter(index);
                            const isThisSelected = selectedOption === index;
                            const isThisCorrect = correctIndex === index;

                            let cardStyle = "bg-white dark:bg-[#1A1A1A] border-[#E5E5E5] dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-600";
                            let letterStyle = "bg-gray-100 dark:bg-[#242424] text-gray-500 dark:text-gray-400";
                            let textStyle = "text-[#1A1A1A] dark:text-white";
                            let showIcon = null;

                            if (isLocked) {
                                if (isThisCorrect) {
                                    if (isTimeElapsed) {
                                        cardStyle = "bg-[#EFF6FF] dark:bg-blue-900/20 border-[#3B82F6] dark:border-[#3B82F6] border-2 shadow-sm z-10";
                                        letterStyle = "bg-[#3B82F6] text-white";
                                        textStyle = "text-[#1A1A1A] dark:text-white font-bold";
                                        showIcon = <span className="w-6 h-6 rounded-full bg-[#3B82F6] text-white flex items-center justify-center text-xs">⏱</span>;
                                    } else {
                                        cardStyle = "bg-[#ECFDF5] dark:bg-emerald-900/20 border-[#10B981] border-2 shadow-sm z-10";
                                        letterStyle = "bg-[#10B981] text-white";
                                        textStyle = "text-[#1A1A1A] dark:text-white font-bold";
                                        showIcon = <span className="w-6 h-6 rounded-full bg-[#10B981] text-white flex items-center justify-center text-xs">✓</span>;
                                    }
                                } else if (isThisSelected && !isThisCorrect) {
                                    cardStyle = "bg-[#FFF1F2] dark:bg-rose-900/20 border-[#E11D48] border-2 shadow-sm z-10";
                                    letterStyle = "bg-[#E11D48] text-white";
                                    textStyle = "text-[#1A1A1A] dark:text-white font-bold";
                                    showIcon = <span className="w-6 h-6 rounded-full bg-[#E11D48] text-white flex items-center justify-center text-xs">✕</span>;
                                } else {
                                    cardStyle = "bg-white dark:bg-[#1A1A1A] border-[#F3F4F6] dark:border-gray-800 opacity-50";
                                    letterStyle = "bg-gray-100 dark:bg-[#242424] text-gray-400 dark:text-gray-600";
                                    textStyle = "text-gray-400 dark:text-gray-500";
                                }
                            } else if (isThisSelected) {
                                // NOT locked, but currently selected
                                cardStyle = "bg-[#FFF9F5] dark:bg-orange-950/20 border-[#FF6B00] border-2 shadow-sm z-10";
                                letterStyle = "bg-[#FF6B00] text-white";
                                textStyle = "text-[#1A1A1A] dark:text-white font-bold";
                            }

                            return (
                                <button
                                    key={index}
                                    onClick={() => {
                                        handleSelect(index);
                                        if (!isLocked) playSound('tap');
                                    }}
                                    disabled={isLocked}
                                    className={`w-full text-left p-4 md:p-5 rounded-[24px] border transition-all flex items-center justify-between gap-4 ${cardStyle}`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${letterStyle}`}>
                                            {letter}
                                        </div>
                                        <span className={`text-sm md:text-base font-medium leading-relaxed ${textStyle}`}>
                                            {opt}
                                        </span>
                                    </div>
                                    {showIcon && <div>{showIcon}</div>}
                                </button>
                            );
                        })}
                    </div>

                    {/* Show "Check Answer" when an option is selected but NOT locked yet */}
                    {!isLocked && selectedOption !== null && (
                        <div className="mt-8 flex justify-end animate-fade-in-up">
                            <button
                                onClick={() => {
                                    handleLockAnswer();
                                    if (correctIndex === selectedOption) {
                                        playSound('correct');
                                    } else {
                                        playSound('wrong');
                                    }
                                }}
                                className="px-8 py-3.5 bg-[#FF6B00] text-white rounded-2xl font-bold text-sm shadow-md shadow-[#FF6B00]/20 hover:bg-[#E05D00] transition-colors flex items-center gap-2"
                            >
                                Check Answer →
                            </button>
                        </div>
                    )}

                    {isLocked && (
                        <div className="mt-8 bg-white dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-gray-800 rounded-[32px] p-8 shadow-sm animate-fade-in-up">
                            <div className="flex items-center gap-2 mb-6">
                                {isTimeElapsed ? (
                                    <>
                                        <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] text-white bg-[#3B82F6]">⏱</span>
                                        <h4 className="text-xs font-black uppercase tracking-widest text-[#3B82F6]">
                                            Time Elapsed. Correct Answer: Option {getLetter(correctIndex)}
                                        </h4>
                                    </>
                                ) : isCorrect ? (
                                    <>
                                        <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] text-white bg-[#10B981]">✓</span>
                                        <h4 className="text-xs font-black uppercase tracking-widest text-[#10B981]">
                                            Correct Answer: Option {getLetter(correctIndex)}
                                        </h4>
                                    </>
                                ) : (
                                    <>
                                        <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] text-white bg-[#E11D48]">✕</span>
                                        <h4 className="text-xs font-black uppercase tracking-widest text-[#E11D48]">
                                            Incorrect. Correct Answer: Option {getLetter(correctIndex)}
                                        </h4>
                                    </>
                                )}
                            </div>

                            <p className="text-sm text-[#4B5563] dark:text-gray-300 leading-loose font-medium mb-6">
                                {question.explanation || "No explanation provided for this question."}
                            </p>

                            <div className="pl-4 border-l-4 border-rose-500 mb-8">
                                <p className="text-[11px] font-bold text-rose-500 italic">
                                    [{question.case_citation || "N/A"}]
                                </p>
                            </div>

                            <div className="flex justify-end">
                                <button
                                    onClick={() => {
                                        playSound('tap');
                                        handleNextQuestion();
                                    }}
                                    className="px-8 py-3.5 bg-[#FF6B00] text-white rounded-2xl font-bold text-sm shadow-md shadow-[#FF6B00]/20 hover:bg-[#E05D00] transition-colors flex items-center gap-2"
                                >
                                    Next Question →
                                </button>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}