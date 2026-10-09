// src/pages/Profile.jsx

import { GlowingEffect } from "../components/ui/glowing-effect";

export default function Profile({
  displayName, avatarUrl, followersCount, followingCount, streakCount,
  setCurrentView, claimStreak, canClaim, leaderboardData, currentUserDbId, openNetworkView,
  bio, joinDate, session, department, lostStreak, restoresLeft, handleRestoreStreak

}) {

  const sortedLeaderboard = [...(leaderboardData || [])].sort((a, b) => b.points - a.points);
  const userRankIndex = sortedLeaderboard.findIndex(u => u.id === currentUserDbId);
  const classRank = userRankIndex !== -1 ? `#${userRankIndex + 1}` : 'Unranked';

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 relative animate-fade-in">

      <div className="flex justify-end gap-2 mb-4 md:absolute md:top-8 md:right-8 z-10">

        {session?.user?.email === 'kolawolejude0@gmail.com' && (
          <button
            onClick={() => setCurrentView('admin')}
            className="px-6 py-2 bg-[#FFF9F5] dark:bg-orange-950/20 border border-[#FFD5C2] dark:border-orange-900/50 rounded-full text-xs font-black text-[#FF6B00] hover:bg-[#FFF2EC] dark:hover:bg-orange-900/40 shadow-sm transition-all"
          >
            ⚙️ Admin
          </button>
        )}

        <button
          onClick={() => setCurrentView('edit_profile')}
          className="px-6 py-2 bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-gray-800 rounded-full text-xs font-bold text-[#1A1A1A] dark:text-white hover:bg-gray-50 dark:hover:bg-[#242424] shadow-sm transition-all"
        >
          Edit Profile
        </button>
      </div>

      <div className="flex flex-col items-center mb-12 mt-4 md:mt-0 text-center">
        <div className="w-28 h-28 md:w-36 md:h-36 rounded-full border-4 border-white dark:border-[#121212] shadow-lg overflow-hidden bg-gradient-to-br from-[#FFD5C2] to-[#FF6B00] mb-4 flex items-center justify-center text-5xl font-black text-white">
          {avatarUrl ? (
            <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            displayName ? displayName.charAt(0).toUpperCase() : 'S'
          )}
        </div>

        <h2 className="text-3xl md:text-4xl font-black tracking-tight text-[#1A1A1A] dark:text-white mb-3">{displayName || 'Student'}</h2>

        {/* 🚀 NEW: DEPARTMENT BOX */}
        <div className="bg-[#FFF9F5] dark:bg-orange-950/20 border border-[#FFD5C2] dark:border-orange-900/50 text-[#FF6B00] px-4 py-1.5 rounded-lg text-[10px] md:text-xs font-black uppercase tracking-widest mb-5 shadow-sm">
          {department || 'UNKNOWN DEPARTMENT'}
        </div>

        <div className="flex items-center gap-3 px-4 py-1.5 bg-gray-50 dark:bg-[#1A1A1A] border border-gray-200 dark:border-gray-800 rounded-full cursor-pointer hover:bg-gray-100 dark:hover:bg-[#242424] transition-colors mb-4">
          <button onClick={() => openNetworkView('following')} className="text-[10px] md:text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest hover:text-[#1A1A1A] dark:hover:text-white transition-colors">
            <span className="text-[#1A1A1A] dark:text-white font-black">{followingCount || 0}</span> Following
          </button>
          <span className="w-1 h-1 bg-gray-300 dark:bg-gray-600 rounded-full"></span>
          <button onClick={() => openNetworkView('followers')} className="text-[10px] md:text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest hover:text-[#1A1A1A] dark:hover:text-white transition-colors">
            <span className="text-[#1A1A1A] dark:text-white font-black">{followersCount || 0}</span> Followers
          </button>
        </div>

        {/* ONLY renders if Bio exists */}
        {bio && (
          <p className="text-sm md:text-base text-[#1A1A1A] dark:text-gray-300 font-medium max-w-md px-4 leading-relaxed mb-1">
            {bio}
          </p>
        )}

        <p className="text-xs text-gray-400 font-bold tracking-widest uppercase mt-3">
          Joined {joinDate || "Sept 2026"}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 w-full max-w-3xl mx-auto">
        <div className="border border-[#FFD5C2] dark:border-orange-900/50 bg-[#FFF9F5] dark:bg-orange-950/20 rounded-[24px] md:rounded-[32px] p-6 md:p-8 flex flex-col justify-center relative shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-white dark:bg-[#242424] rounded-2xl flex items-center justify-center text-2xl shadow-sm border border-[#FFE8D6] dark:border-transparent">🔥</div>
            <div>
              <p className="text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-widest mb-1 text-left">
                {lostStreak > 0 ? "Streak lost" : "Current Streak"}
              </p>
              <p className="text-2xl md:text-3xl font-black text-[#1A1A1A] dark:text-white text-left">
                {lostStreak > 0 ? lostStreak : streakCount} <span className="text-lg text-gray-500 font-bold">Days</span>
              </p>
            </div>
          </div>

          {lostStreak > 0 ? (
            <div>
              <button
                onClick={handleRestoreStreak}
                disabled={restoresLeft <= 0}
                className={`w-full py-4 rounded-xl text-sm font-black tracking-wide uppercase transition-all shadow-sm ${restoresLeft > 0
                  ? 'bg-blue-500 text-white hover:bg-blue-600 hover:shadow-md border border-transparent'
                  : 'bg-white dark:bg-[#1A1A1A] text-gray-400 cursor-not-allowed border border-[#E5E5E5] dark:border-gray-800'
                  }`}
              >
                Restore Streak
              </button>
              <p className="text-[10px] md:text-xs text-center font-bold text-gray-500 dark:text-gray-400 mt-3">
                You have {restoresLeft} free restores left this month.
              </p>
            </div>
          ) : (
            <button
              onClick={claimStreak}
              disabled={!canClaim}
              className={`w-full py-4 rounded-xl text-sm font-black tracking-wide uppercase transition-all shadow-sm ${canClaim
                ? 'bg-[#FF6B00] text-white hover:bg-[#E05D00] hover:shadow-md border border-transparent'
                : 'bg-white dark:bg-[#1A1A1A] text-gray-400 cursor-not-allowed border border-[#E5E5E5] dark:border-gray-800'
                }`}
            >
              {canClaim ? 'Claim Daily Streak' : 'Streak Claimed! 🔥'}
            </button>
          )}
        </div>

        <div className="border border-[#E5E5E5] dark:border-gray-800 bg-white dark:bg-[#1A1A1A] rounded-[24px] md:rounded-[32px] p-6 md:p-8 flex flex-col justify-center shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-[#FFF9F5] dark:bg-[#242424] rounded-2xl flex items-center justify-center text-2xl border border-[#FFE8D6] dark:border-transparent">🏆</div>
            <div>
              <p className="text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-widest mb-1 text-left">Class Rank</p>
              <p className="text-2xl md:text-3xl font-black text-[#1A1A1A] dark:text-white text-left">{classRank}</p>
            </div>
          </div>
        </div>
            </div>
      <div className="mt-6 max-w-3xl mx-auto w-full relative">
        <div className="relative h-full rounded-[32px] border border-[#E5E5E5] dark:border-gray-800 p-1 md:p-1.5">
          <GlowingEffect
            spread={40}
            glow={true}
            disabled={false}
            proximity={64}
            inactiveZone={0.01}
          />
          <div className="relative flex h-full flex-col justify-between gap-4 overflow-hidden rounded-[24px] bg-[#0a0a0a] p-4 md:p-5 shadow-lg">
            <div className="flex items-center justify-between relative z-20">
              <div className="text-[11px] font-bold tracking-[0.15em] uppercase text-gray-500">Subscription</div>
              <div className="text-[9px] font-bold tracking-[0.15em] uppercase text-[#FF6B00] border border-[#FF6B00]/30 bg-[#FF6B00]/10 px-3 py-1 rounded-full">Active</div>
            </div>
            <div className="relative z-20">
              <h3 className="text-2xl md:text-3xl font-black tracking-tight text-white mb-2 flex items-center gap-2 md:gap-3">Super Recall <span className="text-[8px] md:text-xs font-black tracking-widest text-blue-400 bg-blue-500/10 border border-blue-500/30 px-1.5 py-0.5 md:px-2 md:py-1 rounded-md uppercase mt-0.5 md:mt-0">BETA</span></h3>
              <p className="text-sm md:text-base font-medium text-gray-400">
                You have full access to unlimited practice, deep explanations, and the complete course library.
              </p>
            </div>
            <button className="w-fit mt-2 px-6 py-3 bg-[#FF6B00] hover:bg-[#E05D00] text-white font-bold text-sm rounded-[14px] transition-colors shadow-sm relative z-20">
              Manage Subscription
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}