import { useState, useEffect } from 'react';
import { supabase } from '../supabase';

export default function Notifications({ session, currentUserDbId, setCurrentView, openCourseTopics, openReadingScreen, goBack }) {
    const [notifications, setNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!session?.user?.id) return;
        fetchNotifications();
    }, [session]);

    const fetchNotifications = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from('notifications')
            .select('*')
            .eq('user_id', session.user.id)
            .order('created_at', { ascending: false })
            .limit(50);
        
        if (!error && data) {
            setNotifications(data);
            // Mark all as read when they view the page
            const unreadIds = data.filter(n => !n.is_read).map(n => n.id);
            if (unreadIds.length > 0) {
                supabase.from('notifications')
                    .update({ is_read: true })
                    .in('id', unreadIds)
                    .then();
            }
        }
        setIsLoading(false);
    };

    const handleNotificationClick = (notif) => {
        if (!notif.link) return;
        // Basic routing logic: assume link looks like "PUL 201|Topic Name"
        if (notif.link.includes('|')) {
            const [courseCode, topicName] = notif.link.split('|');
            // Hacky navigation: we just pass dummy objects for now
            // Ideally we'd fetch the course object, but openReadingScreen works if we pass params
            openReadingScreen({ code: courseCode }, topicName);
        }
    };

    const formatTime = (isoStr) => {
        const diffMs = new Date() - new Date(isoStr);
        const diffMins = Math.floor(diffMs / 60000);
        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m`;
        const diffHours = Math.floor(diffMins / 60);
        if (diffHours < 24) return `${diffHours}h`;
        return `${Math.floor(diffHours / 24)}d`;
    };

    return (
        <div className="bg-[#f8fafc] dark:bg-[#0a0a0a] min-h-full">
            <div className="max-w-3xl mx-auto p-4 md:p-6 w-full">
                
                {/* Header */}
                <div className="flex items-center gap-3 mb-6 md:mb-8 pt-4">
                    <button onClick={goBack} className="p-2 rounded-full bg-white dark:bg-[#121212] border border-gray-200 dark:border-gray-800 text-[#1A1A1A] dark:text-white shadow-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
                    </button>
                    <h1 className="text-2xl font-black text-[#1A1A1A] dark:text-white tracking-tight">Notifications</h1>
                </div>

                {/* List */}
                <div className="bg-white dark:bg-[#121212] border border-[#E5E5E5] dark:border-gray-800 rounded-[24px] overflow-hidden shadow-sm">
                    {isLoading ? (
                        <div className="p-8 flex justify-center"><div className="w-8 h-8 rounded-full border-4 border-gray-200 border-t-[#FF6B00] animate-spin"></div></div>
                    ) : notifications.length === 0 ? (
                        <div className="p-12 text-center flex flex-col items-center">
                            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4 text-3xl">🔔</div>
                            <h3 className="text-lg font-black text-[#1A1A1A] dark:text-white mb-2">You're all caught up!</h3>
                            <p className="text-sm font-medium text-gray-500">When someone mentions you or interacts with you, it will show up here.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100 dark:divide-gray-800/60">
                            {notifications.map((n) => (
                                <div key={n.id} onClick={() => handleNotificationClick(n)} className={`p-4 md:p-5 flex gap-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-[#1A1A1A] transition-colors ${!n.is_read ? 'bg-orange-50/30 dark:bg-orange-950/10' : ''}`}>
                                    
                                    <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 bg-gray-200 dark:bg-gray-700">
                                        {n.actor_avatar ? <img src={n.actor_avatar} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-lg font-black">{n.actor_name[0]}</div>}
                                    </div>
                                    
                                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                                        <p className="text-sm text-gray-900 dark:text-gray-100 leading-snug">
                                            <span className="font-black">{n.actor_name}</span>{' '}
                                            {n.content}
                                        </p>
                                        <div className="flex items-center gap-2 mt-1.5 text-[11px] font-bold text-[#FF6B00] uppercase tracking-wider">
                                            <span>{n.type === 'mention' ? 'Mentioned You' : 'Notification'}</span>
                                            <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700"></span>
                                            <span className="text-gray-400">{formatTime(n.created_at)}</span>
                                        </div>
                                    </div>

                                    {!n.is_read && (
                                        <div className="flex items-center justify-center shrink-0">
                                            <div className="w-2.5 h-2.5 rounded-full bg-[#FF6B00]"></div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
