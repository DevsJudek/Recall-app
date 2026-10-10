import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { Loader2 } from 'lucide-react';

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
                .order('created_at', { ascending: true });

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
            
            // Optimistically add to list
            if (data) {
                setComments([...comments, data]);
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

    return (
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
            <h3 className="text-lg md:text-xl font-black text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                Discussion <span className="text-xs font-bold bg-gray-100 dark:bg-gray-800 text-gray-500 px-2 py-0.5 rounded-full">{comments.length}</span>
            </h3>

            {/* Comment Form */}
            <form onSubmit={handleSubmit} className="mb-8">
                <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800 shrink-0 overflow-hidden flex items-center justify-center text-[#FF6B00] font-black border-2 border-white dark:border-[#121212]">
                        {avatarUrl ? (
                            <img src={avatarUrl} alt="You" className="w-full h-full object-cover" />
                        ) : (
                            <span>{displayName?.charAt(0)?.toUpperCase() || 'S'}</span>
                        )}
                    </div>
                    <div className="flex-1">
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Share your insights or ask a question..."
                            className="w-full bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-gray-800 rounded-[16px] p-4 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00] transition-all resize-none h-24"
                            maxLength={500}
                        />
                        <div className="flex justify-end mt-2">
                            <button
                                type="submit"
                                disabled={!newComment.trim() || isSubmitting}
                                className="px-5 py-2 bg-[#FF6B00] hover:bg-[#E05D00] text-white font-bold text-xs rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {isSubmitting && <Loader2 className="w-3 h-3 animate-spin" />}
                                Post Comment
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
                <div className="text-center py-8 bg-gray-50 dark:bg-[#121212] rounded-[24px] border border-gray-100 dark:border-gray-800">
                    <p className="text-gray-400 font-medium text-sm">No comments yet. Be the first to share your thoughts!</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {comments.map((comment) => (
                        <div key={comment.id} className="flex gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800 shrink-0 overflow-hidden flex items-center justify-center text-[#FF6B00] font-black border border-gray-100 dark:border-gray-700">
                                {comment.user_avatar ? (
                                    <img src={comment.user_avatar} alt={comment.user_name} className="w-full h-full object-cover" />
                                ) : (
                                    <span>{comment.user_name?.charAt(0)?.toUpperCase() || 'S'}</span>
                                )}
                            </div>
                            <div className="flex-1">
                                <div className="bg-gray-50 dark:bg-[#1A1A1A] p-4 rounded-[20px] rounded-tl-sm border border-gray-100 dark:border-gray-800">
                                    <div className="flex justify-between items-start mb-1">
                                        <h4 className="font-bold text-sm text-gray-900 dark:text-white">
                                            {comment.user_name}
                                            {comment.user_id === session?.user?.id && <span className="ml-2 text-[8px] bg-[#FF6B00]/10 text-[#FF6B00] px-1.5 py-0.5 rounded uppercase tracking-wider">You</span>}
                                        </h4>
                                        <div className="flex items-center gap-2 text-xs text-gray-400">
                                            <span>{new Date(comment.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                                            {comment.user_id === session?.user?.id && (
                                                <button onClick={() => handleDelete(comment.id)} className="hover:text-red-400 transition-colors">
                                                    🗑️
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                                        {comment.content}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
