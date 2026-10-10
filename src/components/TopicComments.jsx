import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { Loader2, ThumbsUp, MessageSquare } from 'lucide-react';

const VerifiedBadge = () => (
    <svg viewBox="0 0 24 24" className="w-[14px] h-[14px] text-[#FFB800] fill-current inline-block ml-1" style={{ marginTop: '-2px' }}>
        <path d="M12 2l2.4 2.4 3.4-.6.6 3.4 2.4 2.4-2.4 2.4-.6 3.4-3.4.6L12 22l-2.4-2.4-3.4.6-.6-3.4-2.4-2.4 2.4-2.4.6-3.4 3.4-.6L12 2z" />
        <path fill="#FFF" d="M10.5 15.5l-3-3 1.4-1.4 1.6 1.6 4.6-4.6 1.4 1.4-6 6z" />
    </svg>
);

const TeamBadge = () => (
    <span className="ml-2 text-[8px] font-black tracking-widest text-[#FF6B00] bg-[#FF6B00]/10 border border-[#FF6B00]/20 px-1.5 py-[2px] rounded uppercase leading-none h-fit flex items-center align-middle">
        TEAM
    </span>
);

export default function TopicComments({ courseCode, topicId, currentUserDbId, displayName, avatarUrl, session }) {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

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
                .order('created_at', { ascending: false });

            if (error) {
                if (error.code === '42P01') {
                    console.log('Comments table not created yet.');
                } else {
                    console.error('Error fetching comments:', error);
                }
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
                .insert([
                    {
                        course_code: courseCode,
                        topic_id: topicId,
                        user_id: session.user.id,
                        user_name: displayName || 'Student',
                        user_avatar: avatarUrl || '',
                        content: newComment.trim()
                    }
                ])
                .select()
                .single();

            if (error) throw error;
            
            if (data) {
                setComments([data, ...comments]);
                setNewComment('');
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

    const timeAgo = (dateStr) => {
        const diff = Math.floor((new Date() - new Date(dateStr)) / 1000);
        if (diff < 60) return `${diff} seconds ago`;
        if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
        return `${Math.floor(diff / 86400)} days ago`;
    };

    return (
        <div className="mt-12 pt-10 font-sans">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                    Discussion ({comments.length})
                </h3>
                <div className="flex items-center text-xs font-medium text-gray-500">
                    Sort by: <span className="font-bold text-gray-900 dark:text-white ml-1 cursor-pointer">Newest</span>
                    <svg className="w-3 h-3 ml-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
            </div>
            
            <hr className="border-gray-200 dark:border-gray-800 mb-8" />

            {/* Comment Form */}
            <form onSubmit={handleSubmit} className="mb-12">
                <div className="flex gap-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full shrink-0 overflow-hidden bg-gray-200 border border-gray-100 dark:border-gray-800 shadow-sm">
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
                    {comments.map((comment) => {
                        const isJude = comment.user_name.toLowerCase().includes('jude');
                        return (
                            <div key={comment.id} className="flex gap-4 group">
                                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full shrink-0 overflow-hidden bg-gray-200 border border-gray-100 dark:border-gray-800 shadow-sm">
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
                                        <h4 className="font-bold text-sm text-gray-900 dark:text-white flex items-center">
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
                                        <button className="flex items-center gap-1.5 hover:text-gray-800 dark:hover:text-gray-300 transition-colors">
                                            <ThumbsUp className="w-3.5 h-3.5" />
                                            <span>{Math.floor(Math.random() * 20)} Likes</span>
                                        </button>
                                        <button className="flex items-center gap-1.5 hover:text-gray-800 dark:hover:text-gray-300 transition-colors">
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
            
            {comments.length > 0 && (
                <div className="flex flex-col items-center justify-center mt-12 mb-6">
                    <button className="px-6 py-2.5 rounded-full border border-gray-200 dark:border-gray-800 text-xs font-bold text-gray-500 hover:bg-gray-50 dark:hover:bg-[#1A1A1A] transition-colors mb-6 shadow-sm">
                        Load more comments
                    </button>
                    <div className="flex items-center gap-1.5 text-[9px] font-black tracking-[0.2em] uppercase text-gray-300 dark:text-gray-600 select-none">
                        <img src="/mockups/recall-logo.png" alt="" className="w-3 h-3 opacity-30 grayscale" />
                        RECALL DISCUSSION
                    </div>
                </div>
            )}
        </div>
    );
}
