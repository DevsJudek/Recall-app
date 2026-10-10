import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../supabase';
import { Loader2, ThumbsUp, MessageSquare } from 'lucide-react';

const VerifiedBadge = () => (
    <svg viewBox="0 0 24 24" className="w-[16px] h-[16px] md:w-[20px] md:h-[20px] text-blue-500 fill-current inline-block ml-1.5" style={{ marginTop: '-2px' }}>
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
    </svg>
);

const TeamBadge = () => (
    <span className="ml-2 text-[9px] md:text-[10px] font-black tracking-widest text-blue-500 bg-blue-500/10 border border-blue-500/20 px-1.5 py-0.5 rounded uppercase leading-none h-fit flex items-center align-middle">
        TEAM
    </span>
);

export default function TopicComments({ courseCode, topicId, currentUserDbId, displayName, avatarUrl, session, viewPeerProfile }) {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    
    // New Feature States
    const [sortOrder, setSortOrder] = useState('Newest');
    const [visibleCount, setVisibleCount] = useState(2);
    const [likedComments, setLikedComments] = useState({});
    
    const inputRef = useRef(null);

    useEffect(() => {
        if (!courseCode || !topicId) return;
        fetchComments();
    }, [courseCode, topicId]);

    const fetchComments = async () => {
        try {
            setIsLoading(true);
            const { data, error } = await supabase
                .from('module_comments')
                .select('*')
                .eq('course_code', courseCode)
                .eq('topic_id', topicId)
                // We'll fetch all and sort them in JS to avoid refetching on sort toggle
                .order('created_at', { ascending: false });

            if (error) {
                if (error.code === '42P01') console.log('Comments table not created yet.');
                setComments([]);
            } else {
                setComments(data || []);
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim() || !session?.user) return;

        setIsSubmitting(true);
        try {
            const { data, error } = await supabase
                .from('module_comments')
                .insert([{
                    course_code: courseCode,
                    topic_id: topicId,
                    user_id: session.user.id,
                    user_name: displayName || 'Student',
                    user_avatar: avatarUrl || '',
                    content: newComment.trim()
                }])
                .select()
                .single();

            if (error) throw error;
            
            if (data) {
                setComments([data, ...comments]);
                setNewComment('');
                setVisibleCount(prev => prev + 1); // Ensure new comment is visible
            }
        } catch (error) {
            console.error('Error posting comment:', error);
            alert('Failed to post comment. Ensure the database table is created.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this comment?")) return;
        try {
            const { error } = await supabase
                .from('module_comments')
                .delete()
                .eq('id', id)
                .eq('user_id', session.user.id);
            if (error) throw error;
            setComments(comments.filter(c => c.id !== id));
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    };

    const handleLike = (id) => {
        setLikedComments(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const handleReply = (userName) => {
        setNewComment(`@${userName} `);
        inputRef.current?.focus();
    };

    const handleViewProfile = async (comment) => {
        if (!viewPeerProfile) return;
        // Fetch full profile first if possible, otherwise pass mock
        try {
            const { data } = await supabase.from('profiles').select('*').eq('id', comment.user_id).single();
            if (data) {
                viewPeerProfile(data);
            } else {
                viewPeerProfile({ id: comment.user_id, name: comment.user_name, avatar: comment.user_avatar });
            }
        } catch {
            viewPeerProfile({ id: comment.user_id, name: comment.user_name, avatar: comment.user_avatar });
        }
    };

    const timeAgo = (dateStr) => {
        const diff = Math.floor((new Date() - new Date(dateStr)) / 1000);
        if (diff < 60) return `${Math.max(1, diff)} seconds ago`;
        if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
        return `${Math.floor(diff / 86400)} days ago`;
    };

    const sortedComments = [...comments].sort((a, b) => {
        const dateA = new Date(a.created_at).getTime();
        const dateB = new Date(b.created_at).getTime();
        return sortOrder === 'Newest' ? dateB - dateA : dateA - dateB;
    });

    const visibleComments = sortedComments.slice(0, visibleCount);
    const hasMoreComments = visibleCount < comments.length;

    return (
        <div className="mt-12 pt-10 font-sans">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                    Discussion ({comments.length})
                </h3>
                <div className="flex items-center text-xs font-medium text-gray-500 relative group">
                    Sort by: 
                    <button 
                        onClick={() => setSortOrder(sortOrder === 'Newest' ? 'Oldest' : 'Newest')}
                        className="font-bold text-gray-900 dark:text-white ml-1 hover:text-[#FF6B00] dark:hover:text-[#FF6B00] transition-colors flex items-center"
                    >
                        {sortOrder}
                        <svg className={`w-3 h-3 ml-1 text-gray-400 transition-transform ${sortOrder === 'Oldest' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </button>
                </div>
            </div>
            
            <hr className="border-gray-200 dark:border-gray-800 mb-8" />

            {/* Comment Form */}
            <form onSubmit={handleSubmit} className="mb-12">
                <div className="flex gap-4">
                    <div 
                        onClick={() => handleViewProfile({ user_id: session?.user?.id, user_name: displayName, user_avatar: avatarUrl })}
                        className="w-10 h-10 md:w-12 md:h-12 rounded-full shrink-0 overflow-hidden bg-gray-200 border border-gray-100 dark:border-gray-800 shadow-sm cursor-pointer"
                    >
                        {avatarUrl ? (
                            <img src={avatarUrl} alt="You" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-[#FF6B00] font-black text-lg bg-gray-100">
                                {displayName?.charAt(0)?.toUpperCase() || 'S'}
                            </div>
                        )}
                    </div>
                    <div className="flex-1 flex flex-col">
                        <textarea
                            ref={inputRef}
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Add to the discussion..."
                            className="w-full bg-[#F8F9FA] dark:bg-[#1A1A1A] border border-gray-200 dark:border-gray-800 rounded-[12px] p-5 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00] transition-all resize-none h-28"
                            maxLength={500}
                        />
                        <div className="flex justify-end mt-4">
                            <button
                                type="submit"
                                disabled={!newComment.trim() || isSubmitting}
                                className="px-6 py-3 bg-[#FF6B00] hover:bg-[#E05D00] text-white font-bold text-sm rounded-[10px] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm"
                            >
                                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                                Post Comment →
                            </button>
                        </div>
                    </div>
                </div>
            </form>

            {/* Comments List */}
            {isLoading ? (
                <div className="flex justify-center py-8">
                    <Loader2 className="w-6 h-6 text-[#FF6B00] animate-spin" />
                </div>
            ) : comments.length === 0 ? (
                <div className="text-center py-10">
                    <p className="text-gray-400 font-medium text-sm">No comments yet. Be the first to share your thoughts!</p>
                </div>
            ) : (
                <div className="space-y-8">
                    {visibleComments.map((comment) => {
                        const isJude = comment.user_name.toLowerCase().includes('jude');
                        // Using charcode sum to seed a stable random "base" likes count for visual demo
                        const baseLikes = comment.id.charCodeAt(0) % 20; 
                        const hasLiked = likedComments[comment.id];
                        const totalLikes = baseLikes + (hasLiked ? 1 : 0);

                        return (
                            <div key={comment.id} className="flex gap-4 group">
                                <div 
                                    onClick={() => handleViewProfile(comment)}
                                    className="w-10 h-10 md:w-12 md:h-12 rounded-full shrink-0 overflow-hidden bg-gray-200 border border-gray-100 dark:border-gray-800 shadow-sm cursor-pointer hover:opacity-80 transition-opacity"
                                >
                                    {comment.user_avatar ? (
                                        <img src={comment.user_avatar} alt={comment.user_name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-[#FF6B00] font-black text-lg bg-gray-100">
                                            {comment.user_name?.charAt(0)?.toUpperCase() || 'S'}
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 pt-1">
                                    <div className="flex flex-wrap items-center mb-2 leading-none gap-2">
                                        <h4 
                                            onClick={() => handleViewProfile(comment)}
                                            className="font-bold text-sm text-gray-900 dark:text-white flex items-center cursor-pointer hover:underline"
                                        >
                                            {comment.user_name}
                                            {isJude && <VerifiedBadge />}
                                            {isJude && <TeamBadge />}
                                        </h4>
                                        <span className="text-[11px] font-medium text-gray-400">
                                            {timeAgo(comment.created_at)}
                                        </span>
                                    </div>
                                    <p className="text-[14px] text-gray-700 dark:text-gray-300 leading-[1.6] whitespace-pre-wrap mb-4">
                                        {comment.content}
                                    </p>
                                    <div className="flex items-center gap-6 text-[11px] font-bold text-gray-500">
                                        <button 
                                            onClick={() => handleLike(comment.id)}
                                            className={\`flex items-center gap-1.5 transition-colors \${hasLiked ? 'text-[#FF6B00]' : 'hover:text-gray-800 dark:hover:text-gray-300'}\`}
                                        >
                                            <ThumbsUp className={\`w-3.5 h-3.5 \${hasLiked ? 'fill-current' : ''}\`} />
                                            <span>{totalLikes} Likes</span>
                                        </button>
                                        <button 
                                            onClick={() => handleReply(comment.user_name)}
                                            className="flex items-center gap-1.5 hover:text-gray-800 dark:hover:text-gray-300 transition-colors"
                                        >
                                            <MessageSquare className="w-3.5 h-3.5" />
                                            <span>Reply</span>
                                        </button>
                                        {comment.user_id === session?.user?.id && (
                                            <button onClick={() => handleDelete(comment.id)} className="text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                                                Delete
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
            
            {hasMoreComments && (
                <div className="flex flex-col items-center justify-center mt-12 mb-6 animate-fade-in">
                    <button 
                        onClick={() => setVisibleCount(prev => prev + 3)}
                        className="px-6 py-2.5 rounded-full border border-gray-200 dark:border-gray-800 text-xs font-bold text-gray-500 hover:bg-gray-50 dark:hover:bg-[#1A1A1A] transition-colors mb-6 shadow-sm"
                    >
                        Load more comments
                    </button>
                    <div className="flex items-center gap-1.5 text-[9px] font-black tracking-[0.2em] uppercase text-gray-300 dark:text-gray-600 select-none">
                        <img src="/mockups/recall-logo.png" alt="" className="w-3 h-3 opacity-30 grayscale" />
                        RECALL DISCUSSION
                    </div>
                </div>
            )}
            {!hasMoreComments && comments.length > 0 && (
                 <div className="flex flex-col items-center justify-center mt-12 mb-6">
                 <div className="flex items-center gap-1.5 text-[9px] font-black tracking-[0.2em] uppercase text-gray-300 dark:text-gray-600 select-none">
                     <img src="/mockups/recall-logo.png" alt="" className="w-3 h-3 opacity-30 grayscale" />
                     RECALL DISCUSSION
                 </div>
             </div>
            )}
        </div>
    );
}
