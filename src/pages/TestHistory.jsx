import { useState, useEffect } from 'react';
import { supabase } from '../supabase';

export default function TestHistory({ setCurrentView, session }) {
    const [history, setHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchHistory() {
            if (!session?.user?.id) return;
            const { data, error } = await supabase
                .from('test_history')
                .select('*')
                .eq('user_id', session.user.id)
                .order('created_at', { ascending: false })
                .limit(30);
            
            if (data && !error) {
                setHistory(data);
            }
            setIsLoading(false);
        }
        fetchHistory();
    }, [session?.user?.id]);

    const formatDate = (dateString) => {
        const d = new Date(dateString);
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' });
    };

    return (
        <div className="bg-[#F8F9FA] dark:bg-[#0a0a0a] flex flex-col font-sans min-h-[100dvh]">
            <div className="bg-white dark:bg-[#121212] border-b border-gray-100 dark:border-gray-800 sticky top-0 z-10 px-4 py-4 flex items-center justify-between shadow-sm">
                <button
                    onClick={() => setCurrentView('practice_setup')}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                    <svg className="w-6 h-6 text-gray-700 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <h1 className="text-lg font-black tracking-tight text-[#1A1A1A] dark:text-white">Test History</h1>
                <div className="w-10"></div>
            </div>

            <div className="p-4 max-w-2xl mx-auto w-full pb-24">
                {isLoading ? (
                    <div className="flex justify-center py-10">
                        <div className="animate-spin h-6 w-6 border-2 border-[#FF6B00] border-t-transparent rounded-full"></div>
                    </div>
                ) : history.length === 0 ? (
                    <div className="bg-white dark:bg-[#121212] p-8 rounded-[24px] text-center border border-dashed border-gray-200 dark:border-gray-800 mt-4 shadow-sm">
                        <div className="text-4xl mb-3">🕒</div>
                        <h3 className="text-[#1A1A1A] dark:text-white font-bold text-lg mb-1">No history yet</h3>
                        <p className="text-gray-400 dark:text-gray-500 text-sm">Your completed practice tests will appear here.</p>
                    </div>
                ) : (
                    <div className="space-y-3 mt-2">
                        {history.map((item) => {
                            const isRanked = item.mode === 'ranked';
                            const isCompleted = item.completed !== false;
                            const accuracy = item.total_questions > 0 ? Math.round((item.score / item.total_questions) * 100) : 0;
                            
                            return (
                                <div key={item.id} className={`bg-white dark:bg-[#121212] border p-4 rounded-[20px] shadow-sm flex flex-col gap-2.5 ${!isCompleted ? 'border-yellow-200 dark:border-yellow-900/40' : 'border-gray-100 dark:border-gray-800'}`}>
                                    <div className="flex justify-between items-start">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className={`text-[10px] uppercase font-black tracking-wider px-2 py-0.5 rounded-md ${isRanked ? 'bg-[#FFF2EC] text-[#FF6B00] dark:bg-orange-950/30' : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'}`}>
                                                    {isRanked ? '🔥 Ranked' : '📝 Normal'}
                                                </span>
                                                {!isCompleted && (
                                                    <span className="text-[10px] uppercase font-black tracking-wider px-2 py-0.5 rounded-md bg-yellow-50 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400">
                                                        ⚠ Incomplete
                                                    </span>
                                                )}
                                                {isCompleted && (
                                                    <span className="text-[10px] uppercase font-black tracking-wider px-2 py-0.5 rounded-md bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400">
                                                        ✓ Completed
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-bold text-[#1A1A1A] dark:text-white">
                                                    {item.course_code === 'mixed' ? 'Mixed Topics' : item.course_code}
                                                </span>
                                                <span className="text-[10px] text-gray-400 font-medium">•</span>
                                                <span className="text-[11px] text-gray-400 font-medium">{formatDate(item.created_at)}</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <span className="text-xl font-black text-[#1A1A1A] dark:text-white">{item.score}<span className="text-sm text-gray-400 font-bold">/{item.total_questions}</span></span>
                                            <span className={`text-xs font-black ${accuracy >= 70 ? 'text-green-500' : accuracy >= 40 ? 'text-yellow-500' : 'text-red-500'}`}>{accuracy}%</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
