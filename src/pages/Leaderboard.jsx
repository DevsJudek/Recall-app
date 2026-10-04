// src/pages/Leaderboard.jsx
import { useState, useEffect } from 'react';

const formatPoints = (points) => (points || 0).toLocaleString();

const renderAvatar = (user) => {
    if (user?.avatar && user.avatar.startsWith('http')) {
        return <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />;
    }
    return user?.name ? user.name.charAt(0).toUpperCase() : '?';
};

const PodiumCard = ({ user, rank, isFirst, viewPeerProfile }) => {
    if (!user) return <div className="w-24 md:w-32" />;
    const height = isFirst ? "h-48 md:h-52" : "h-36 md:h-40";
    const bg = isFirst ? "bg-[#FFF9F5] dark:bg-orange-950/20 shadow-sm" : "bg-gray-100 dark:bg-[#1A1A1A]";

    return (
        <div className="flex flex-col items-center justify-end w-24 md:w-28 relative group cursor-pointer mx-1 md:mx-2" onClick={() => viewPeerProfile(user)}>
            <div className={`absolute -top-5 md:-top-7 z-10 w-12 h-12 md:w-16 md:h-16 rounded-full border-4 border-white dark:border-[#121212] overflow-hidden shadow-md flex items-center justify-center font-black text-white text-lg ${isFirst ? 'bg-gradient-to-br from-[#FFD5C2] to-[#FF6B00]' : 'bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-700 dark:to-gray-800'}`}>
                {renderAvatar(user)}
            </div>
            <div className={`w-full ${height} ${bg} rounded-t-3xl flex flex-col items-center pt-8 md:pt-10 pb-4 px-2 text-center transition-transform group-hover:-translate-y-1`}>
                {isFirst ? <span className="text-xl mb-1 mt-1">👑</span> : <span className="text-2xl font-black text-gray-300 dark:text-gray-700 mb-1">{rank}</span>}
                <p className="text-[11px] md:text-xs font-black text-[#1A1A1A] dark:text-white truncate w-full">{user.name.split(' ')[0]}</p>
                <p className="text-[8px] md:text-[9px] text-gray-400 font-bold mb-auto tracking-widest uppercase mt-0.5">{formatPoints(user.points)} PTS</p>
                {/* Background matches theme */}
                <div className="text-[9px] md:text-[10px] font-black px-2.5 py-1 rounded-lg shadow-sm mt-2 flex items-center gap-1 bg-white dark:bg-[#242424] text-[#FF6B00]">🔥 {user.current_streak || 0}</div>
            </div>
        </div>
    );
};

    
export default function Leaderboard({ leaderboardData, currentUserDbId, viewPeerProfile, startPractice }) {
    const [resetString, setResetString] = useState('');

    useEffect(() => {
        const calculateReset = () => {
            const now = new Date();
            const dayOfWeek = now.getDay();
            const daysUntilSunday = dayOfWeek === 0 ? 0 : 7 - dayOfWeek;
            const nextSunday = new Date(now.getFullYear(), now.getMonth(), now.getDate() + daysUntilSunday, 23, 59, 59);
            const diffMs = nextSunday - now;
            const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
            const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            // Removed "Resets in " to save space
            setResetString(`${diffDays}d ${diffHours}h`);
        };
        calculateReset();
        const interval = setInterval(calculateReset, 1000 * 60 * 60);
        return () => clearInterval(interval);
    }, []);

    const sortedData = [...leaderboardData].sort((a, b) => (b.points || 0) - (a.points || 0));
    const top3 = sortedData.slice(0, 3);
    const restOfTop12 = sortedData.slice(3, 12);
    const currentUserIndex = sortedData.findIndex(u => u.id === currentUserDbId);
    const currentUser = currentUserIndex !== -1 ? sortedData[currentUserIndex] : null;
    const currentUserRank = currentUserIndex !== -1 ? currentUserIndex + 1 : 'Unranked';

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
            {/* Forced flex-row and slightly scaled down for mobile to fit perfectly side-by-side */}
            <div className="flex flex-row justify-center items-center gap-2 md:gap-4 px-2 md:px-8 mb-10 scale-[0.95] md:scale-100">
                <div className="bg-[#F8F9FA] dark:bg-[#1A1A1A] p-1.5 rounded-2xl flex border border-[#E5E5E5] dark:border-gray-800 shrink-0">
                    <button className="px-5 md:px-6 py-2 bg-white dark:bg-[#333333] text-[#1A1A1A] dark:text-white text-[11px] font-bold rounded-xl shadow-sm">Weekly</button>
                    <button disabled className="px-3 md:px-6 py-2 text-gray-400 dark:text-gray-600 text-[11px] font-bold rounded-xl cursor-not-allowed opacity-60 flex items-center gap-1.5">Semester <span>🔒</span></button>
                </div>
                <div className="flex items-center gap-1 text-[10px] font-black text-[#FF6B00] uppercase tracking-widest bg-[#FFF9F5] dark:bg-orange-950/30 border border-[#FFD5C2] dark:border-orange-900/50 px-3.5 py-2.5 rounded-full shadow-sm whitespace-nowrap">
                    <span className="text-sm">⏱</span> {resetString}
                </div>
            </div>

            <div className="flex justify-center items-end px-4 mb-8">
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

            {/* Adjusted bottom margin by 3px (bottom-[93px]) and reduced padding on the inner card */}
            <div className="fixed bottom-[93px] md:bottom-[21px] left-0 w-full px-4 z-40 pointer-events-none">
                <div className="max-w-[280px] mx-auto bg-[#111827] dark:bg-[#1A1A1A] rounded-3xl px-4 py-3 flex flex-col items-center gap-2.5 shadow-2xl border border-gray-800 dark:border-gray-700 pointer-events-auto">
                    <div className="flex items-center gap-8 w-full justify-center">
                        <div className="text-center"><p className="text-[8px] text-gray-400 font-black uppercase tracking-widest mb-1">Your Rank</p><p className="text-xl font-black text-white leading-none">#{currentUserRank}</p></div>
                        <div className="w-px h-6 bg-gray-700"></div>
                        <div className="text-center"><p className="text-[8px] text-gray-400 font-black uppercase tracking-widest mb-1">Points</p><p className="text-xl font-black text-[#FF6B00] leading-none">{formatPoints(currentUser?.points)}</p></div>
                    </div>
                    <button onClick={() => startPractice(null, 'ranked')} className="w-full mt-1 py-2.5 bg-[#FF6B00] text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-[#e05d00] transition-colors shadow-lg shadow-[#FF6B00]/20 flex items-center justify-center gap-1.5">
                        Take a ranked test →
                    </button>
                </div>
            </div>
        </div>
    );
}