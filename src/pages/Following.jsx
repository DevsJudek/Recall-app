// src/pages/Following.jsx

export default function Following({ networkUsers, viewPeerProfile, isOwnProfileNetwork }) {
    return (
        <div className="max-w-2xl mx-auto py-8 px-4 animate-fade-in">

            {/* 🚀 Standardized Header (Matches Dashboard) */}
            <div className="mb-8">
                <h1 className="text-2xl md:text-4xl font-black tracking-tight text-[#1A1A1A] dark:text-white mb-1">
                    Following
                </h1>
                <p className="text-xs md:text-sm font-medium text-gray-500 dark:text-gray-400">
                    Peers you are learning with.
                </p>
            </div>

            <div className="space-y-3">
                {networkUsers && networkUsers.length > 0 ? networkUsers.map(user => (
                    <div key={user.id} onClick={() => viewPeerProfile(user)} className="flex items-center justify-between p-4 bg-white dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-gray-800 rounded-2xl cursor-pointer hover:border-[#FF6B00] dark:hover:border-[#FF6B00] hover:shadow-sm transition-all group">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 border border-[#E5E5E5] dark:border-gray-700 text-[#1A1A1A] dark:text-white rounded-full flex items-center justify-center text-lg font-black overflow-hidden group-hover:border-[#FF6B00] dark:group-hover:border-[#FF6B00]">
                                {user.avatar && user.avatar.startsWith('http') ? <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" /> : user.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <p className="font-bold text-[#1A1A1A] dark:text-white text-sm">{user.name}</p>
                                <p className="text-[9px] font-black tracking-widest text-gray-400 dark:text-gray-500 uppercase mt-0.5">{user.faculty || 'Law'} • {user.level || '300L'}</p>
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="text-center py-16 bg-[#F8F9FA] dark:bg-[#1A1A1A] rounded-[32px] border border-dashed border-[#E5E5E5] dark:border-gray-800">
                        <p className="text-sm font-bold text-gray-400 dark:text-gray-500 mb-2">
                            {isOwnProfileNetwork ? "You aren't following anyone" : 'This person is not following anyone'}
                        </p>
                        {isOwnProfileNetwork && (
                            <p className="text-[10px] font-bold text-gray-400 dark:text-gray-600 uppercase tracking-widest">Find peers on the Leaderboard</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}