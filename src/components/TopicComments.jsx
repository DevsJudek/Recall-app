import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../supabase';
import { Loader2, ThumbsUp, MessageSquare } from 'lucide-react';

const VerifiedBadge = () => (
    <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] md:w-[22px] md:h-[22px] text-blue-500 fill-current inline-block ml-1.5" style={{ marginTop: '-2px' }}>
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
    </svg>
);



export default function TopicComments({ courseCode, topicId, currentUserDbId, displayName, avatarUrl, session, viewPeerProfile }) {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    
    // New Feature States
    const [sortOrder, setSortOrder] = useState('Newest');
    const [visibleCount, setVisibleCount] = useState(2);
    
    // Autocomplete States
    const [showMentions, setShowMentions] = useState(false);
    const [mentionQuery, setMentionQuery] = useState('');
    const [mentionResults, setMentionResults] = useState([]);
    const [mentionCursor, setMentionCursor] = useState(0);
    
    
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
                
                const loadedComments = data || [];
                // Sort by most liked first, then by newest
                loadedComments.sort((a, b) => {
                    const likesA = Array.isArray(a.liked_by) ? a.liked_by.length : 0;
                    const likesB = Array.isArray(b.liked_by) ? b.liked_by.length : 0;
                    if (likesB !== likesA) return likesB - likesA;
                    return new Date(b.created_at) - new Date(a.created_at);
                });
                setComments(loadedComments);
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleTextChange = async (e) => {
        const val = e.target.value;
        setNewComment(val);
        
        const match = val.match(/@([a-zA-Z0-9_]*)$/);
        
        if (match) {
            setShowMentions(true);
            setMentionQuery(match[1]);
            setMentionCursor(val.length - match[1].length - 1);
            
            if (match[1].length > 0) {
                const { data } = await supabase.from('profiles').select('name, avatar').ilike('name', '%' + match[1] + '%').limit(4);
                setMentionResults(data || []);
            } else {
                const { data } = await supabase.from('profiles').select('name, avatar').not('name', 'is', null).limit(4);
                setMentionResults(data || []);
            }
        } else {
            setShowMentions(false);
        }
    };
    
    const insertMention = (name) => {
        const before = newComment.substring(0, mentionCursor);
        const tag = name.split(' ')[0].replace(/\s+/g, '');
        setNewComment(before + '@' + tag + ' ');
        setShowMentions(false);
        inputRef.current?.focus();
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
                    profile_id: currentUserDbId,
                    user_name: displayName || 'Student',
                    user_avatar: avatarUrl || '',
                    content: newComment.trim()
                }])
                .select()
                .single();

            if (error) throw error;
            
            if (data) {
                
                const updatedComments = [data, ...comments];
                updatedComments.sort((a, b) => {
                    const likesA = Array.isArray(a.liked_by) ? a.liked_by.length : 0;
                    const likesB = Array.isArray(b.liked_by) ? b.liked_by.length : 0;
                    if (likesB !== likesA) return likesB - likesA;
                    return new Date(b.created_at) - new Date(a.created_at);
                });
                setComments(updatedComments);
                
                // MENTION DETECTION & NOTIFICATION EMITTER
                const mentionMatches = newComment.match(/@([a-zA-Z0-9_]+)/g);
                if (mentionMatches) {
                    mentionMatches.forEach(match => {
                        const mentionedName = match.substring(1); // Strip '@'
                        // Search anywhere in the name (e.g. Kolawole Judek matches @judek)
                        supabase.from('profiles').select('id').ilike('name', '%' + mentionedName + '%').limit(1).single().then(({ data: profileData }) => {
                            if (profileData && profileData.id) {
                                supabase.from('notifications').insert([{
                                    user_id: profileData.id,
                                    actor_name: displayName || 'Student',
                                    actor_avatar: avatarUrl || '',
                                    type: 'mention',
                                    content: `mentioned you in ${courseCode}: ${topicId.replace(/^\d+\s*/, '')}`,
                                    link: `${courseCode}|${topicId}`
                                }])
.then(({error}) => { if (error) alert("Supabase Error: " + JSON.stringify(error)); else console.log("Notif inserted!"); });
                            }
                        });
                    });
                }
                
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

    const handleLike = async (id) => {
        if (!session?.user) return;
        const comment = comments.find(c => c.id === id);
        if (!comment) return;

        const currentLikedBy = Array.isArray(comment.liked_by) ? comment.liked_by : [];
        const hasLiked = currentLikedBy.includes(session.user.id);
        const newLikedBy = hasLiked 
            ? currentLikedBy.filter(uid => uid !== session.user.id)
            : [...currentLikedBy, session.user.id];

        // Optimistic update
        
          // Optimistic update and re-sort
          const updated = comments.map(c => c.id === id ? { ...c, liked_by: newLikedBy } : c);
          updated.sort((a, b) => {
              const likesA = Array.isArray(a.liked_by) ? a.liked_by.length : 0;
              const likesB = Array.isArray(b.liked_by) ? b.liked_by.length : 0;
              if (likesB !== likesA) return likesB - likesA;
              return new Date(b.created_at) - new Date(a.created_at);
          });
          setComments(updated);

        try {
            const { error } = await supabase
                .from('module_comments')
                .update({ liked_by: newLikedBy })
                .eq('id', id);
            if (error) throw error;
        } catch (error) {
            console.error('Error updating likes:', error);
            // Silent revert if column doesn't exist yet
            setComments(comments.map(c => c.id === id ? { ...c, liked_by: currentLikedBy } : c));
        }
    };

    const handleReply = (userName) => {
        setNewComment(`@${userName} `);
        inputRef.current?.focus();
    };

    const handleViewProfile = async (comment) => {
        if (!viewPeerProfile) return;
        try {
            if (comment.profile_id) {
                const { data } = await supabase.from('profiles').select('*').eq('id', comment.profile_id).single();
                if (data) return viewPeerProfile(data);
            }
            
            // Fallback for older comments without profile_id
            const { data } = await supabase.from('profiles').select('*').eq('name', comment.user_name).limit(1).maybeSingle();
            if (data) return viewPeerProfile(data);
            
            throw new Error('Profile not found');
        } catch (error) {
            console.error('Error fetching peer profile:', error);
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
                        <div className="relative">
                            <textarea
                                ref={inputRef}
                                value={newComment}
                                onChange={handleTextChange}
                                placeholder="Add to the discussion... (Type @ to tag someone)"
                                className="w-full bg-[#F8F9FA] dark:bg-[#1A1A1A] border border-gray-200 dark:border-gray-800 rounded-[12px] p-5 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00] transition-all resize-none h-28"
                                maxLength={500}
                            />
                            
                            {showMentions && mentionResults.length > 0 && (
                                <div className="absolute bottom-[105%] left-0 w-64 bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-gray-800 rounded-xl shadow-xl overflow-hidden z-50">
                                    <div className="px-3 py-2 bg-gray-50 dark:bg-[#121212] border-b border-gray-200 dark:border-gray-800">
                                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Tag a user</span>
                                    </div>
                                    {mentionResults.map((user, idx) => (
                                        <div 
                                            key={idx} 
                                            onClick={() => insertMention(user.name)}
                                            className="flex items-center gap-3 px-3 py-2.5 hover:bg-orange-50 dark:hover:bg-orange-900/20 cursor-pointer transition-colors"
                                        >
                                            <div className="w-6 h-6 rounded-full bg-gray-200 overflow-hidden shrink-0">
                                                {user.avatar ? (
                                                    <img src={user.avatar} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-[#FF6B00] font-bold text-[10px]">
                                                        {user.name?.charAt(0)}
                                                    </div>
                                                )}
                                            </div>
                                            <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                                                {user.name}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
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
                        const isCurrentUser = comment.user_id === session?.user?.id;
                        const displayAvatar = isCurrentUser ? avatarUrl : comment.user_avatar;
                        const displayUserName = isCurrentUser ? (displayName || 'Student') : comment.user_name;
                        const isJude = displayUserName.toLowerCase().includes('jude');
                        const currentLikedBy = Array.isArray(comment.liked_by) ? comment.liked_by : [];
                        const hasLiked = currentLikedBy.includes(session?.user?.id);
                        const totalLikes = currentLikedBy.length;

                        return (
                            <div key={comment.id} className="flex gap-4 group">
                                <div 
                                    onClick={() => handleViewProfile(comment)}
                                    className="w-10 h-10 md:w-12 md:h-12 rounded-full shrink-0 overflow-hidden bg-gray-200 border border-gray-100 dark:border-gray-800 shadow-sm cursor-pointer hover:opacity-80 transition-opacity"
                                >
                                    {displayAvatar ? (
                                        <img src={displayAvatar} alt={displayUserName} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-[#FF6B00] font-black text-lg bg-gray-100">
                                            {displayUserName?.charAt(0)?.toUpperCase() || 'S'}
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 pt-1">
                                    <div className="flex flex-wrap items-center mb-2 leading-none gap-2">
                                        <h4 
                                            onClick={() => handleViewProfile(comment)}
                                            className="font-bold text-sm text-gray-900 dark:text-white flex items-center cursor-pointer hover:underline"
                                        >
                                            {displayUserName}
                                            {isJude && <VerifiedBadge />}
                                            
                                        </h4>
                                        <span className="text-[11px] font-medium text-gray-400">
                                            {timeAgo(comment.created_at)}
                                        </span>
                                    </div>
                                    <p className="text-[14px] text-gray-700 dark:text-gray-300 leading-[1.6] whitespace-pre-wrap mb-4">
                                        {comment.content.split(/(@[a-zA-Z0-9_]+)/g).map((part, i) => 
                                            part.startsWith('@') ? (
                                                <span key={i} className="text-blue-600 dark:text-blue-400 font-bold bg-blue-50 dark:bg-blue-900/30 px-1 py-0.5 rounded-md cursor-pointer hover:underline">
                                                    {part}
                                                </span>
                                            ) : (
                                                <span key={i}>{part}</span>
                                            )
                                        )}
                                    </p>
                                    <div className="flex items-center gap-6 text-[11px] font-bold text-gray-500">
                                        <button 
                                            onClick={() => handleLike(comment.id)}
                                            className={`flex items-center gap-1.5 transition-colors ${hasLiked ? 'text-[#FF6B00]' : 'hover:text-gray-800 dark:hover:text-gray-300'}`}
                                        >
                                            <ThumbsUp className={`w-3.5 h-3.5 ${hasLiked ? 'fill-current' : ''}`} />
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
            {!hasMoreComments && comments.length > 2 && (
                <div className="flex flex-col items-center justify-center mt-12 mb-6 animate-fade-in">
                    <button 
                        onClick={() => {
                            setVisibleCount(2);
                            // Optionally scroll back up to comments start
                            // window.scrollBy({ top: -500, behavior: 'smooth' });
                        }}
                        className="px-6 py-2.5 rounded-full border border-gray-200 dark:border-gray-800 text-xs font-bold text-gray-500 hover:bg-gray-50 dark:hover:bg-[#1A1A1A] transition-colors mb-6 shadow-sm"
                    >
                        Hide comments
                    </button>
                    <div className="flex items-center gap-1.5 text-[9px] font-black tracking-[0.2em] uppercase text-gray-300 dark:text-gray-600 select-none">
                        <img src="/mockups/recall-logo.png" alt="" className="w-3 h-3 opacity-30 grayscale" />
                        RECALL DISCUSSION
                    </div>
                </div>
            )}
            {!hasMoreComments && comments.length > 0 && comments.length <= 2 && (
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
