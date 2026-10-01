// src/pages/Network.jsx
export default function Network({ networkData, networkType, networkOwner, viewPeerProfile, goBack, currentUserDbId }) {

    const isMe = networkOwner?.id === currentUserDbId;

    const renderAvatar = (user) => {
        if (user?.avatar && user.avatar.startsWith('http')) {
            return <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />;
        }
        return user?.name ? user.name.charAt(0).toUpperCase() : '?';
    };

    const title = networkType === 'followers'
        ? (isMe ? 'Your Followers' : `${networkOwner?.name?.split(' ')[0]}'s Followers`)
        : (isMe ? 'You are Following' : `${networkOwner?.name?.split(' ')[0]} is Following`);

    return (
        <div className="max-w-4xl mx-auto pt-6 pb-32 font-sans px-4">

            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <button onClick={goBack} className="w-10 h-10 bg-white dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-gray-800 rounded-full flex items-center justify-center text-[#1A1A1A] dark:text-white hover:bg-gray-50 dark:hover:bg-[#242424] shadow-sm transition-colors text-lg font-black">
                    ←
                </button>
                <h1 className="text-2xl md:text-3xl font-black text-[#1A1A1A] dark:text-white">{title}</h1>
            </div>

            {/* Network List */}
            <div className="bg-white dark:bg-[#121212] border border-[#E5E5E5] dark:border-gray-800 rounded-[32px] p-2 md:p-4 shadow-sm">
                {networkData.length === 0 ? (
                    <div className="text-center p-12">
                        <div className="text-4xl mb-3">👻</div>
                        <p className="text-sm font-bold text-[#1A1A1A] dark:text-white">It's a bit quiet here...</p>
                        <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mt-1">No active users found in this list</p>
                    </div>
                ) : (
                    <div className="space-y-1">
                        {networkData.map((user) => (
                            <div
                                key={user.id}
                                onClick={() => viewPeerProfile(user)}
                                className="flex items-center justify-between p-3 bg-white dark:bg-[#1A1A1A] rounded-2xl hover:bg-gray-50 dark:hover:bg-[#242424] transition-colors cursor-pointer border border-transparent hover:border-gray-100 dark:hover:border-gray-800 shadow-sm md:shadow-none"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 shadow-sm flex items-center justify-center text-white font-black text-lg overflow-hidden shrink-0 border-2 border-white dark:border-[#121212]">
                                        {renderAvatar(user)}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <p className="text-sm font-bold text-[#1A1A1A] dark:text-white">{user.name}</p>
                                            {user.id === currentUserDbId && (
                                                <span className="text-[9px] bg-gray-800 dark:bg-gray-700 text-white px-2 py-0.5 rounded-full tracking-widest align-middle">YOU</span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{user.faculty || 'Law'}</p>
                                            <span className="text-gray-300 dark:text-gray-700">•</span>
                                            <p className="text-[10px] font-bold text-[#FF6B00]">{user.points?.toLocaleString() || 0} XP</p>
                                        </div>
                                    </div>
                                </div>
                                <span className="text-[#FF6B00] font-black text-xl pr-2">›</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}