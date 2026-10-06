// src/pages/PeerProfile.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../supabase';

export default function PeerProfile({ selectedPeer, isFollowing, handleFollowToggle, currentUserDbId, openNetwork }) {
    const [peerRank, setPeerRank] = useState('...');

    useEffect(() => {
        async function fetchRank() {
            if (!selectedPeer?.id) return;

            // 🚀 FIXED: Now correctly ranks the peer based on THEIR specific department and level!
            const { data } = await supabase
                .from('profiles')
                .select('id, points')
                .eq('department', selectedPeer.department || 'Law')
                .eq('level', selectedPeer.level || '300L')
                .gt('points', 0)
                .order('points', { ascending: false });

            if (data) {
                const index = data.findIndex(u => u.id === selectedPeer.id);
                setPeerRank(index !== -1 ? `#${index + 1}` : 'Unranked');
            }
        }
        fetchRank();
    }, [selectedPeer]);

    if (!selectedPeer) return null;
    const isSelf = selectedPeer.id === currentUserDbId;

    return (
        <div className="max-w-4xl mx-auto pt-10 pb-32 font-sans px-4">

            <div className="flex flex-col items-center text-center">

                <div className="w-28 h-28 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 rounded-full flex items-center justify-center text-4xl text-white font-black shadow-md mb-4 overflow-hidden border-4 border-white dark:border-[#121212]">
                    {selectedPeer.avatar && selectedPeer.avatar.startsWith('http') ? <img src={selectedPeer.avatar} alt="Avatar" className="w-full h-full object-cover" /> : (selectedPeer.name?.charAt(0).toUpperCase() || '?')}
                </div>

                <h2 className="text-3xl md:text-4xl font-black text-[#1A1A1A] dark:text-white mb-3 flex items-center justify-center gap-2">
                    {selectedPeer.name}
                    {isSelf && <span className="text-[10px] bg-gray-800 dark:bg-gray-700 text-white px-2 py-0.5 rounded-full tracking-widest align-middle">YOU</span>}
                </h2>

                {/* 🚀 NEW: DEPARTMENT BOX */}
                <div className="bg-[#FFF9F5] dark:bg-orange-950/20 border border-[#FFD5C2] dark:border-orange-900/50 text-[#FF6B00] px-4 py-1.5 rounded-lg text-[10px] md:text-xs font-black uppercase tracking-widest mb-5 shadow-sm">
                    {selectedPeer.department || 'LAW'}
                </div>

                <div className="flex items-center bg-gray-50 dark:bg-[#1A1A1A] border border-gray-100 dark:border-gray-800 rounded-full text-xs md:text-sm font-medium text-[#666666] dark:text-gray-400 mb-4 overflow-hidden shadow-sm">
                    <button
                        onClick={() => openNetwork('following', selectedPeer)}
                        className="flex items-center gap-1.5 px-6 py-3 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors focus:outline-none"
                    >
                        <span className="font-bold text-[#1A1A1A] dark:text-white">{selectedPeer.following_count || 0}</span> Following
                    </button>
                    <div className="w-px h-5 bg-gray-200 dark:bg-gray-700"></div>
                    <button
                        onClick={() => openNetwork('followers', selectedPeer)}
                        className="flex items-center gap-1.5 px-6 py-3 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors focus:outline-none"
                    >
                        <span className="font-bold text-[#1A1A1A] dark:text-white">{selectedPeer.followers_count || 0}</span> Followers
                    </button>
                </div>

                {/* ONLY renders if Bio exists */}
                {selectedPeer.bio && (
                    <p className="text-sm md:text-base text-[#1A1A1A] dark:text-gray-300 font-medium max-w-md px-4 leading-relaxed">
                        {selectedPeer.bio}
                    </p>
                )}

                <p className="text-xs text-gray-400 font-bold tracking-widest uppercase mt-3 mb-8">
                    Joined {selectedPeer.created_at ? new Date(selectedPeer.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : "Sept 2026"}
                </p>

                {!isSelf ? (
                    <button onClick={handleFollowToggle} className={`w-full max-w-[280px] py-4 rounded-xl text-sm font-bold shadow-sm transition-all mb-12 ${isFollowing ? 'bg-gray-100 dark:bg-[#242424] text-[#1A1A1A] dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700' : 'bg-[#FF6B00] text-white hover:bg-[#e05d00]'}`}>
                        {isFollowing ? 'Following ✓' : 'Follow'}
                    </button>
                ) : <div className="mb-12"></div>}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
                    <div className="bg-[#FFF9F5] dark:bg-orange-950/20 border border-[#FFD5C2] dark:border-orange-900/50 rounded-[32px] p-6 md:p-8 flex items-center gap-5 shadow-sm hover:shadow-md transition-shadow">
                        <div className="w-14 h-14 bg-white dark:bg-[#242424] rounded-2xl flex items-center justify-center text-3xl shadow-sm text-[#FF6B00]">🔥</div>
                        <div>
                            <p className="text-[10px] md:text-xs font-black text-gray-500 uppercase tracking-widest mb-1 text-left">Current Streak</p>
                            <p className="text-2xl md:text-3xl font-black text-[#1A1A1A] dark:text-white text-left">{selectedPeer.current_streak || 0} Days</p>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-gray-800 rounded-[32px] p-6 md:p-8 flex items-center gap-5 shadow-sm hover:shadow-md transition-shadow">
                        <div className="w-14 h-14 bg-[#F8F9FA] dark:bg-[#242424] rounded-2xl flex items-center justify-center text-3xl shadow-sm">🏆</div>
                        <div>
                            <p className="text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-widest mb-1 text-left">Class Rank</p>
                            <p className="text-2xl md:text-3xl font-black text-[#1A1A1A] dark:text-white text-left">{peerRank}</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}