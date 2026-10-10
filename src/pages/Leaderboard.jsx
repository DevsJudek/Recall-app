// src/pages/Leaderboard.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../supabase';

const formatPoints = (points) => (points || 0).toLocaleString();

const renderAvatar = (user) => {
    if (user?.avatar && user.avatar.startsWith('http')) {
        return <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />;
    }
    return user?.name ? user.name.charAt(0).toUpperCase() : '?';
};

const PodiumCard = ({ user, rank, isFirst, viewPeerProfile }) => {
    if (!user) return <div className="w-24 md:w-28" />;
    return (
        <div className={`flex flex-col items-center justify-end w-24 md:w-28 relative group cursor-pointer mx-1 md:mx-2 pb-2 ${isFirst ? 'mb-8' : 'mb-0'}`} onClick={() => viewPeerProfile(user)}>
            {/* Avatar floating */}
            <div className="relative mb-3">
                <div className="z-10 w-16 h-16 md:w-20 md:h-20 rounded-full border-4 border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm flex items-center justify-center font-black text-white text-xl bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-700 dark:to-gray-800">
                    {renderAvatar(user)}
                </div>
                {isFirst && <div className="absolute -top-3 -right-2 text-2xl drop-shadow-md z-20">👑</div>}
                  {!isFirst && <div className="absolute -top-2 -right-1 w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-800 border-2 border-white dark:border-[#121212] flex items-center justify-center text-[10px] font-black text-gray-500 z-20 shadow-sm">{rank}</div>}
            </div>
            
            {/* Inline metadata underneath */}
            <div className="flex flex-col items-center text-center w-full z-10">
                <p className="text-xs md:text-sm font-black text-[#1A1A1A] dark:text-white truncate w-full mb-1">{user.name.split(' ')[0]}</p>
                <div className="flex items-center justify-center gap-1.5 text-[9px] md:text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-full">
                    <span>{formatPoints(user.points)} pts</span>
                    <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700 shrink-0"></span>
                    <span className="text-[#FF6B00] flex items-center gap-0.5 shrink-0">🔥 {user.current_streak || 0}</span>
                </div>
            </div>

            
        </div>
    );
};

    
export default function Leaderboard({ leaderboardData, currentUserDbId, viewPeerProfile, startPractice, department, campus }) {
    const [scope, setScope] = useState('class'); 
    const [fetchedData, setFetchedData] = useState({ department: null, campus: null });
    const [isLoadingScope, setIsLoadingScope] = useState(false);

    const handleScopeChange = async (newScope) => {
        setScope(newScope);
        if (newScope === 'class') return;
        
        if (!fetchedData[newScope]) {
            setIsLoadingScope(true);
            try {
                let query = supabase
                    .from('profiles')
                    .select('id, name, avatar, points, department, level, followers_count, following_count, current_streak, bio, previous_rank, created_at')
                    .gt('points', 0)
                    .order('points', { ascending: false })
                    .limit(20);

                if (newScope === 'department') {
                    query = query.eq('department', department || 'Law');
                } else if (newScope === 'campus') {
                    query = query.eq('campus', campus || 'Obafemi Awolowo University (OAU)');
                }

                const { data } = await query;
                if (data) {
                    setFetchedData(prev => ({ ...prev, [newScope]: data }));
                }
            } catch (err) {
                console.error(err);
            }
            setIsLoadingScope(false);
        }
    };

    const activeData = scope === 'class' ? leaderboardData : (fetchedData[scope] || []);
    const sortedData = [...activeData].sort((a, b) => (b.points || 0) - (a.points || 0));
    const top3 = sortedData.slice(0, 3);
    const restOfTop12 = sortedData.slice(3, 12);
    const currentUserIndex = sortedData.findIndex(u => u.id === currentUserDbId);
    const currentUser = currentUserIndex !== -1 ? sortedData[currentUserIndex] : leaderboardData.find(u => u.id === currentUserDbId);
    const currentUserRank = currentUserIndex !== -1 ? currentUserIndex + 1 : '20+';

const getRankTrend = (currentRank, previousRank) => {
        if (!previousRank || currentRank === previousRank) {
            return <p className="text-[8px] font-black text-gray-400 mt-0.5">-</p>;
        }
        const diff = previousRank - currentRank;
        if (diff > 0) {
            return <p className="text-[8px] font-black text-emerald-500 mt-0.5">▲ {diff}</p>;
        }
        return <p className="text-[8px] font-black text-red-500 mt-0.5">▼ {Math.abs(diff)}</p>;
    };

    return (
        <div className="max-w-4xl mx-auto pt-4 pb-48 md:pb-36 font-sans relative">
            
            {/* INLINE FILTERS ROW */}
            <div className="flex flex-row justify-between items-center px-4 md:px-8 mb-10 w-full">
                
                {/* SCOPE DROPDOWN */}
                <div className="relative shrink-0">
                    <select 
                        value={scope} 
                        onChange={(e) => handleScopeChange(e.target.value)}
                        className="appearance-none bg-white dark:bg-[#1A1A1A] text-[#1A1A1A] dark:text-white border border-[#E5E5E5] dark:border-gray-800 text-[11px] font-black py-1.5 pl-3 pr-7 rounded-xl outline-none focus:ring-1 focus:ring-[#FF6B00] cursor-pointer shadow-sm capitalize"
                    >
                        <option value="class">Class</option>
                        <option value="department">Department</option>
                        <option value="campus">Campus</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 text-gray-500">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg>
                    </div>
                </div>

                {/* WEEKLY */}
                <div className="flex items-center gap-2">
                    <div className="bg-[#F8F9FA] dark:bg-[#1A1A1A] p-1 rounded-lg flex border border-[#E5E5E5] dark:border-gray-800 shrink-0 shadow-inner">
                        <button className="px-3 py-1 bg-white dark:bg-[#333333] text-[#1A1A1A] dark:text-white text-[10px] font-bold rounded shadow-sm">Weekly</button>
                        <button disabled className="px-2 py-1 text-gray-400 dark:text-gray-600 text-[10px] font-bold rounded cursor-not-allowed opacity-60 flex items-center gap-1">Semester <span>🔒</span></button>
                    </div>
                </div>
            </div>

            {isLoadingScope ? (
                <div className="flex flex-col items-center justify-center py-20 opacity-50">
                    <div className="w-8 h-8 rounded-full border-4 border-gray-200 dark:border-gray-800 border-t-[#FF6B00] animate-spin mb-4"></div>
                    <p className="text-xs font-bold text-gray-400">Loading {scope} leaderboard...</p>
                </div>
            ) : sortedData.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center px-6">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center text-2xl mb-4">🏆</div>
                    <h3 className="text-[#1A1A1A] dark:text-white font-black mb-2">No data yet</h3>
                    <p className="text-xs text-gray-400 font-medium">Be the first to practice and climb the {scope} leaderboard!</p>
                </div>
            ) : (
                <>
                    <div className="flex justify-center items-end px-4 mb-3 animate-fade-in-up">
                        <PodiumCard user={top3[1]} rank={2} isFirst={false} viewPeerProfile={viewPeerProfile} />
                        <PodiumCard user={top3[0]} rank={1} isFirst={true} viewPeerProfile={viewPeerProfile} />
                        <PodiumCard user={top3[2]} rank={3} isFirst={false} viewPeerProfile={viewPeerProfile} />
                    </div>

                    <div className="px-4 md:px-8 space-y-1 mb-8">
                {restOfTop12.map((user, index) => {
                    const actualRank = index + 4;
                    return (
                        <div key={user.id} onClick={() => viewPeerProfile(user)} className="flex items-center justify-between p-3 bg-white dark:bg-[#1A1A1A] rounded-2xl hover:bg-gray-50 dark:hover:bg-[#242424] transition-colors cursor-pointer border border-transparent hover:border-gray-100 dark:hover:border-gray-800">
                            <div className="flex items-center gap-3 md:gap-4">
                                <div className="w-6 text-center">
                                    <p className="text-sm font-black text-[#1A1A1A] dark:text-white">{actualRank}</p>
                                    {getRankTrend(actualRank, user.previous_rank)}
                                </div>
                                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center text-white font-black text-xs shrink-0 shadow-sm overflow-hidden">
                                    {renderAvatar(user)}
                                </div>
                                <div>
                                    <p className="text-xs md:text-sm font-bold text-[#1A1A1A] dark:text-white leading-tight">{user.name?.split(' ')[0]}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 md:gap-12">
                                <span className="text-[11px] md:text-xs font-black text-[#FF6B00]">🔥 {user.current_streak || 0}</span>
                                <div className="text-right w-16"><p className="text-sm font-black text-[#1A1A1A] dark:text-white leading-none">{formatPoints(user.points)}</p><p className="text-[8px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mt-1">Points</p></div>
                            </div>
                        </div>
                    );
                })}
            </div>
            </>
            )}

            {/* Adjusted bottom margin by 3px (bottom-[93px]) and reduced padding on the inner card */}
            <div className="fixed bottom-[93px] md:bottom-[21px] left-0 md:left-64 right-0 px-4 z-40 pointer-events-none">
                <div className="max-w-[280px] mx-auto bg-[#111827] dark:bg-[#1A1A1A] rounded-3xl px-4 py-3 flex flex-col items-center gap-2.5 shadow-2xl border border-gray-800 dark:border-gray-700 pointer-events-auto">
                    <div className="flex items-center gap-8 w-full justify-center">
                        <div className="text-center"><p className="text-[8px] text-gray-400 font-black uppercase tracking-widest mb-1">Your Rank</p><p className="text-xl font-black text-white leading-none">#{currentUserRank}</p></div>
                        <div className="w-px h-6 bg-gray-700"></div>
                        <div className="text-center"><p className="text-[8px] text-gray-400 font-black uppercase tracking-widest mb-1">Points</p><p className="text-xl font-black text-[#FF6B00] leading-none">{formatPoints(currentUser?.points)}</p></div>
                    </div>
                    <button onClick={() => startPractice(null, 'ranked')} className="w-full mt-1 py-2.5 bg-[#FF6B00] text-white text-[10px] font-black uppercase tracking-widest rounded-[14px] hover:bg-[#e05d00] transition-colors shadow-lg shadow-[#FF6B00]/20 flex items-center justify-center gap-1.5">
                        Take a ranked test →
                    </button>
                </div>
            </div>
        </div>
    );
}