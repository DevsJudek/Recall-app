// src/App.jsx
/* eslint-disable */
import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { supabase } from './supabase';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import CourseLibrary from './pages/CourseLibrary';
import CourseTopics from './pages/CourseTopics';
import Reading from './pages/Reading';
import PracticeSetup from './pages/PracticeSetup';
import Quiz from './pages/Quiz';
import TestResult from './pages/TestResult';
import Leaderboard from './pages/Leaderboard';
import PeerProfile from './pages/PeerProfile';
import Sidebar from './components/Sidebar';
import MobileNav from './components/MobileNav';
import AdminDashboard from './pages/AdminDashboard';
import Followers from './pages/Followers';
import Following from './pages/Following';
import ShareTopic from './pages/ShareTopic';
import Onboarding from './pages/Onboarding';

import HamsterLoader from './components/HamsterLoader';
import PullToRefresh from './components/PullToRefresh';
import PublicShareView from './pages/PublicShareView';

// 🚀 IMPORT OUR NEW SOUND PROVIDER
import { SoundProvider, useSound } from './contexts/SoundContext';

class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false, error: null, errorInfo: null }; }
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  componentDidCatch(error, errorInfo) { console.error("App Crashed:", error, errorInfo); this.setState({ errorInfo }); }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '24px', backgroundColor: '#fef2f2', color: '#991b1b', minHeight: '100vh' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '900' }}>App Crashed!</h2>
          <div style={{ backgroundColor: 'white', padding: '12px', marginTop: '16px', borderRadius: '8px' }}>
            <p style={{ fontWeight: 'bold' }}>{this.state.error && this.state.error.toString()}</p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const GlobalStyles = () => (
  <style dangerouslySetInnerHTML={{
    __html: `
    html, body { margin: 0; padding: 0; height: 100%; width: 100%; overflow: hidden !important; overscroll-behavior: none !important; touch-action: none; position: fixed; top: 0; left: 0; }
    #root { height: 100%; width: 100%; overflow: hidden; }
    .scrollable-content { touch-action: auto !important; overscroll-behavior: contain !important; -webkit-overflow-scrolling: touch; }
  `}} />
);

function AppContent() {
  const mainScrollRef = useRef(null);
  const { playSound } = useSound();

  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isManualRefreshing, setIsManualRefreshing] = useState(false);
  const [publicData, setPublicData] = useState({ isPublic: false, course: null, topic: null });

  const [isOnboarded, setIsOnboarded] = useState(true);
  const [isSupported, setIsSupported] = useState(true);

  // 🌙 DARK MODE STATE
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) return savedTheme === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      document.body.style.backgroundColor = '#0a0a0a';
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      document.body.style.backgroundColor = '#ffffff';
    }
  }, [isDarkMode]);

  const [currentView, setCurrentView] = useState('dashboard');
  const [viewHistory, setViewHistory] = useState([]);
  const [activeCourse, setActiveCourse] = useState(null);
  const [networkUsers, setNetworkUsers] = useState([]);
  const [isOwnProfileNetwork, setIsOwnProfileNetwork] = useState(true);
  const [shareTarget, setShareTarget] = useState({ course: '', topic: '' });

  const [coursesList, setCoursesList] = useState([]);
  const [courseLastStudied, setCourseLastStudied] = useState({});

  const [topicStatus, setTopicStatus] = useState({});
  const [readingData, setReadingData] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isLocked, setIsLocked] = useState(false);
  const [score, setScore] = useState(0);
  const [practiceMode, setPracticeMode] = useState('ranked');

  const [currentUserDbId, setCurrentUserDbId] = useState(null);
  const [displayName, setDisplayName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [department, setDepartment] = useState('Law');
  const [level, setLevel] = useState('300L');
  const [bio, setBio] = useState('');

  const [leaderboardData, setLeaderboardData] = useState([]);
  const [selectedPeer, setSelectedPeer] = useState(null);

  const [dailyTarget, setDailyTarget] = useState(25);
  const [dailyProgress, setDailyProgress] = useState(0);

  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [followingList, setFollowingList] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [streakCount, setStreakCount] = useState(0);
  const [canClaimStreak, setCanClaimStreak] = useState(true);

  const [editName, setEditName] = useState('');
  const [editDepartment, setEditDepartment] = useState('Law');
  const [editLevel, setEditLevel] = useState('300L');
  const [editAvatarUrl, setEditAvatarUrl] = useState(null);
  const [editBio, setEditBio] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const fetchCourses = useCallback(async () => {
    try {
      const [{ data: coursesData }, { data: readingsData }] = await Promise.all([
        supabase.from('courses').select('*').order('level'),
        supabase.from('module_readings').select('course_code, topic')
      ]);

      if (coursesData && coursesData.length > 0) {
        const dynamicCourses = coursesData.map(c => {
          const courseReadings = readingsData?.filter(r => r.course_code === c.code) || [];
          const uniqueTopics = new Set(courseReadings.map(r => r.topic)).size;
          return {
            ...c,
            is_available: c.is_available !== false,
            topics_count: uniqueTopics > 0 ? uniqueTopics : (c.topics_count || 1)
          };
        });
        setCoursesList(dynamicCourses);
      }
    } catch (e) {
      console.error("Error fetching courses", e);
    }
  }, []);

  const fetchUserData = useCallback(async (activeSession, isSilent = false) => {
    if (!isSilent) setIsLoading(true);
    try {
      const userEmail = activeSession.user.email;
      const authName = activeSession.user.user_metadata?.full_name || 'Student';

      let { data: byEmail } = await supabase.from('profiles').select('*').eq('email', userEmail).order('id', { ascending: false }).limit(1);
      let userProfile = byEmail?.[0];

      if (!userProfile) {
        const { data: created } = await supabase.from('profiles').insert([{
          name: authName, email: userEmail, points: 0, campus: 'OAU',
          avatar: '', bio: '', current_streak: 0, streak: 0, followers_count: 0, following_count: 0, department: 'Law', level: '300L',
          daily_progress: 0, daily_date: new Date().toDateString(), course_progress: {}, course_last_studied: {},
          is_onboarded: false, daily_target: 25
        }]).select();
        userProfile = created?.[0];
      }

      const { data: boardData } = await supabase
        .from('profiles')
        .select('id, name, avatar, points, department, level, followers_count, following_count, current_streak, bio')
        .eq('department', userProfile?.department || 'Law')
        .eq('level', userProfile?.level || '300L')
        .order('points', { ascending: false })
        .limit(20);

      if (userProfile && boardData) {
        const isUserInBoard = boardData.some(u => u.id === userProfile.id);
        let finalBoardData = boardData;
        if (!isUserInBoard) finalBoardData = [...boardData, userProfile];

        setLeaderboardData(finalBoardData.sort((a, b) => b.points - a.points));
        setCurrentUserDbId(userProfile.id);
        setDisplayName(userProfile.name || 'Student');
        setAvatarUrl(userProfile.avatar || null);
        setDepartment(userProfile.department || 'Law');
        setLevel(userProfile.level || '300L');
        setBio(userProfile.bio || '');
        setTopicStatus(userProfile.course_progress || {});
        setCourseLastStudied(userProfile.course_last_studied || {});
        setFollowingCount(userProfile.following_count || 0);
        setFollowersCount(userProfile.followers_count || 0);

        setIsOnboarded(userProfile.is_onboarded);
        setDailyTarget(userProfile.daily_target || 25);

        const checkSupport = (userProfile.department?.toUpperCase() === 'LAW' || userProfile.department === 'Law') && userProfile.level === '300L';
        setIsSupported(checkSupport);

        if (userProfile.is_onboarded === false) {
          setCurrentView('onboarding');
        } else if (currentView === 'onboarding') {
          setCurrentView('dashboard');
        }

        let actualStreak = userProfile.current_streak || 0;
        let canClaim = true;

        if (userProfile.last_claim_timestamp) {
          const todayDate = new Date(); todayDate.setHours(0, 0, 0, 0);
          const lastClaimDate = new Date(userProfile.last_claim_timestamp); lastClaimDate.setHours(0, 0, 0, 0);
          const diffDays = Math.floor((todayDate.getTime() - lastClaimDate.getTime()) / (1000 * 60 * 60 * 24));

          if (diffDays === 0) canClaim = false;
          else if (diffDays > 1) {
            actualStreak = 0; canClaim = true; supabase.from('profiles').update({ current_streak: 0 }).eq('id', userProfile.id).then();
          } else if (diffDays === 1) canClaim = true;
        }

        setStreakCount(actualStreak); setCanClaimStreak(canClaim);

        const todayStr = new Date().toDateString();
        if (userProfile.daily_date === todayStr) {
          setDailyProgress(userProfile.daily_progress || 0);
        } else {
          setDailyProgress(0); await supabase.from('profiles').update({ daily_progress: 0, daily_date: todayStr }).eq('id', userProfile.id);
        }
      }
    } catch (error) { console.error("Data Fetch Error:", error); }
    finally { if (!isSilent) setIsLoading(false); }
  }, [currentView]);

  const handleManualRefresh = async () => {
    if (session) {
      setIsManualRefreshing(true);
      await Promise.all([
        fetchUserData(session, true),
        fetchCourses()
      ]);
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then((registrations) => {
          for (let registration of registrations) registration.update();
        });
      }
      setIsManualRefreshing(false);
    }
  };

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && session) {
        handleManualRefresh();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [session, fetchUserData, fetchCourses]);

  useEffect(() => { if (mainScrollRef.current) mainScrollRef.current.scrollTop = 0; }, [currentView, activeCourse]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('course') && params.get('topic')) {
      setPublicData({ isPublic: true, course: params.get('course'), topic: params.get('topic') });
      return;
    }
    fetchCourses();
  }, [fetchCourses]);

  useEffect(() => {
    if (publicData.isPublic) return;
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, activeSession) => {
      if (activeSession) {
        setSession(activeSession);
        if (event === 'INITIAL_SESSION' || event === 'SIGNED_IN') fetchUserData(activeSession);
      } else {
        setSession(null); clearUserState(); setIsLoading(false);
      }
    });
    return () => subscription.unsubscribe();
  }, [publicData.isPublic, fetchUserData]);

  const handleCompleteOnboarding = async (data) => {
    setIsUploading(true);

    const isSupportCheck = (data.department.toUpperCase() === 'LAW') && data.level === '300L';

    await supabase.from('profiles').update({
      name: data.name,
      department: data.department,
      level: data.level,
      daily_target: data.dailyTarget,
      is_onboarded: true
    }).eq('id', currentUserDbId);

    setDisplayName(data.name);
    setDepartment(data.department);
    setLevel(data.level);
    setDailyTarget(data.dailyTarget);
    setIsOnboarded(true);
    setIsSupported(isSupportCheck);

    await handleManualRefresh();

    setIsUploading(false);
    setCurrentView('dashboard');
  };

  const smartSetCurrentView = (view) => {
    if (!isOnboarded) {
      setCurrentView('onboarding');
      return;
    }
    if (!isSupported && ['courses', 'course_topics', 'reading', 'practice_setup', 'quiz', 'leaderboard', 'share_topic'].includes(view)) {
      setCurrentView('dashboard');
      return;
    }

    const rootViews = ['dashboard', 'courses', 'leaderboard', 'profile', 'onboarding'];
    if (rootViews.includes(view)) { setViewHistory([]); setCurrentView(view); }
    else {
      const existingIndex = viewHistory.indexOf(view);
      if (existingIndex !== -1) { setViewHistory(prev => prev.slice(0, existingIndex)); setCurrentView(view); }
      else if (currentView !== view) { setViewHistory(prev => [...prev, currentView]); setCurrentView(view); }
    }
  };

  const goBack = () => {
    if (viewHistory.length > 0) { const newHistory = [...viewHistory]; const prevView = newHistory.pop(); setViewHistory(newHistory); setCurrentView(prevView); }
    else { setCurrentView('dashboard'); }
  };

  const clearUserState = () => {
    setCurrentUserDbId(null); setDisplayName(''); setAvatarUrl(null); setDepartment('Law'); setLevel('300L'); setBio('');
    setTopicStatus({}); setFollowingList([]); setFollowingCount(0); setFollowersCount(0); setStreakCount(0);
    setDailyProgress(0); setScore(0); setLeaderboardData([]); setCourseLastStudied({}); setIsOnboarded(true); setIsSupported(true);
  };

  useEffect(() => {
    if (currentView === 'edit_profile') {
      setEditName(displayName || ''); setEditDepartment(department || 'Law'); setEditLevel(level || '300L'); setEditAvatarUrl(avatarUrl); setEditBio(bio || '');
    }
  }, [currentView, displayName, department, level, avatarUrl, bio]);

  const streakCalendar = useMemo(() => {
    const calendar = []; const today = new Date(); today.setHours(0, 0, 0, 0);
    for (let i = 6; i >= 0; i--) {
      const dateObj = new Date(today); dateObj.setDate(dateObj.getDate() - i);
      const streakEndDate = new Date(today); if (canClaimStreak) streakEndDate.setDate(streakEndDate.getDate() - 1);
      const daysFromEnd = Math.floor((streakEndDate - dateObj) / (1000 * 60 * 60 * 24));
      const isChecked = daysFromEnd >= 0 && daysFromEnd < streakCount;
      calendar.push({ dayName: dateObj.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase(), isChecked, isToday: i === 0 });
    }
    return calendar;
  }, [streakCount, canClaimStreak]);

  const formatLastStudied = (isoString) => {
    if (!isoString) return 'Not started';
    const now = new Date(); const past = new Date(isoString); const diffMs = now - past;
    if (diffMs < 0) return 'Just now';
    const diffMins = Math.floor(diffMs / (1000 * 60)); const diffHours = Math.floor(diffMins / 60); const diffDays = Math.floor(diffHours / 24);
    if (diffMins < 1) return 'Just now'; if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`; if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`; return '7d ago';
  };

  const processedCoursesList = useMemo(() => {
    return coursesList
      .filter(c => c.level === level && c.department === department)
      .map(c => ({ ...c, last_studied: formatLastStudied(courseLastStudied[c.code]) }));
  }, [coursesList, courseLastStudied, level, department]);

  const recordCourseActivity = (courseCode) => {
    if (!courseCode) return;
    const now = new Date().toISOString(); const updated = { ...courseLastStudied, [courseCode]: now };
    setCourseLastStudied(updated);
    if (currentUserDbId) supabase.from('profiles').update({ course_last_studied: updated }).eq('id', currentUserDbId).then();
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]; if (!file) return; setIsUploading(true);
    const fileName = `${currentUserDbId}-${Math.random()}.${file.name.split('.').pop()}`;
    const { error: uploadError } = await supabase.storage.from('avatars').upload(fileName, file);
    if (!uploadError) { const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(fileName); setEditAvatarUrl(publicUrl); }
    setIsUploading(false);
  };

  const handleSaveProfile = async () => {
    if (!currentUserDbId) return;
    setDisplayName(editName); setAvatarUrl(editAvatarUrl); setDepartment(editDepartment); setLevel(editLevel); setBio(editBio);
    await supabase.from('profiles').update({ name: editName, avatar: editAvatarUrl, department: editDepartment, level: editLevel, bio: editBio }).eq('id', currentUserDbId);
    await handleManualRefresh();
    smartSetCurrentView('profile');
  };

  const handleClaimStreak = async () => {
    if (!canClaimStreak || !session || !currentUserDbId) return;

    playSound('success');

    const newStreak = streakCount + 1; const now = new Date().toISOString();
    setStreakCount(newStreak); setCanClaimStreak(false);
    await supabase.from('profiles').update({ current_streak: newStreak, streak: newStreak, last_claim_timestamp: now }).eq('id', currentUserDbId).then();
  };

  const handleFollowToggle = async () => {
    if (!selectedPeer || !session || !currentUserDbId) return;
    const isCurrentlyFollowing = isFollowing; const targetPeerId = selectedPeer.id;
    setIsFollowing(!isCurrentlyFollowing);
    const newFollowingCount = isCurrentlyFollowing ? Math.max(0, followingCount - 1) : followingCount + 1;
    setFollowingCount(newFollowingCount);
    const newPeerFollowersCount = isCurrentlyFollowing ? Math.max(0, (selectedPeer.followers_count || 0) - 1) : (selectedPeer.followers_count || 0) + 1;
    setSelectedPeer(prev => ({ ...prev, followers_count: newPeerFollowersCount }));
    setLeaderboardData(prev => prev.map(u => {
      if (u.id === targetPeerId) return { ...u, followers_count: newPeerFollowersCount };
      if (u.id === currentUserDbId) return { ...u, following_count: newFollowingCount };
      return u;
    }));
    if (isCurrentlyFollowing) await supabase.from('follows').delete().match({ follower_id: currentUserDbId, following_id: targetPeerId });
    else await supabase.from('follows').insert([{ follower_id: currentUserDbId, following_id: targetPeerId }]);
  };

  const openNetworkView = async (type, targetPeer = null) => {
    setIsTransitioning(true); setIsOwnProfileNetwork(!targetPeer);
    const targetId = targetPeer ? targetPeer.id : currentUserDbId;
    try {
      const field = type === 'following' ? 'following_id' : 'follower_id';
      const matchField = type === 'following' ? 'follower_id' : 'following_id';
      const { data } = await supabase.from('follows').select(field).eq(matchField, targetId);
      if (data && data.length > 0) {
        const ids = data.map(d => d[field]);
        const { data: users } = await supabase.from('profiles').select('*').in('id', ids);
        setNetworkUsers(users || []);
      } else setNetworkUsers([]);
      smartSetCurrentView(type);
    } catch (error) { console.error("Error fetching network:", error); }
    finally { setTimeout(() => setIsTransitioning(false), 200); }
  };

  const viewPeerProfile = async (user) => {
    setSelectedPeer(user);
    if (currentUserDbId && user) {
      const { data } = await supabase.from('follows').select('*').match({ follower_id: currentUserDbId, following_id: user.id }).maybeSingle();
      setIsFollowing(!!data);
    } else setIsFollowing(false);
    smartSetCurrentView('peer_profile');
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setSession(null); clearUserState(); smartSetCurrentView('dashboard');
  };

  const openLeaderboard = async () => {
    setIsTransitioning(true);
    await handleManualRefresh();
    smartSetCurrentView('leaderboard');
    setTimeout(() => setIsTransitioning(false), 200);
  };

  useEffect(() => {
    if (currentView !== 'quiz' || practiceMode === 'normal') return;
    if (timeLeft > 0 && !isLocked) { const timerId = setInterval(() => setTimeLeft((t) => t - 1), 1000); return () => clearInterval(timerId); }
    else if (timeLeft === 0 && practiceMode === 'ranked') { setIsLocked(true); }
  }, [timeLeft, isLocked, currentView, practiceMode]);

  const openCourseTopics = (course) => { setActiveCourse(course); smartSetCurrentView('course_topics'); };
  const getCourseMastery = (courseCode, topicsCount) => {
    let completed = 0; Object.entries(topicStatus || {}).forEach(([key, status]) => { if (key.startsWith(courseCode) && status === 'COMPLETED') completed++; });
    return topicsCount ? Math.min(100, Math.round((completed / topicsCount) * 100)) : 0;
  };

  const openReadingScreen = async (course, topicTitle) => {
    setActiveCourse(course); if (course?.code) recordCourseActivity(course.code);
    const topicKey = `${course.code}_${topicTitle}`;
    if (topicStatus[topicKey] !== 'COMPLETED') {
      const newStatus = { ...topicStatus, [topicKey]: 'IN PROGRESS' };
      setTopicStatus(newStatus);
      if (currentUserDbId) await supabase.from('profiles').update({ course_progress: newStatus }).eq('id', currentUserDbId);
    }
    setIsTransitioning(true);
    const { data } = await supabase.from('module_readings').select('*').eq('course_code', course.code).eq('topic', topicTitle);
    if (data && data.length > 0) { setReadingData(data); smartSetCurrentView('reading'); } else alert("Content not uploaded yet!");
    setIsTransitioning(false);
  };

  const markTopicCompleted = async (course, topicTitle) => {
    const newStatus = { ...topicStatus, [`${course.code}_${topicTitle}`]: 'COMPLETED' };
    setTopicStatus(newStatus);
    if (currentUserDbId) await supabase.from('profiles').update({ course_progress: newStatus }).eq('id', currentUserDbId);
    goBack();
  };

  const startPractice = async (courseInput, mode = 'ranked') => {
    setPracticeMode(mode); setIsTransitioning(true);
    const questionLimit = mode === 'ranked' ? 15 : 30;
    let query = supabase.from('questions').select('*');
    if (courseInput === 'mixed' || courseInput === null) setActiveCourse(null);
    else if (typeof courseInput === 'string') {
      const resolvedCode = courseInput.toUpperCase();
      query = query.ilike('course_code', `%${courseInput.substring(0, 3)}%${courseInput.substring(courseInput.length - 3)}%`);
      setActiveCourse({ code: resolvedCode }); recordCourseActivity(resolvedCode);
    } else if (courseInput && courseInput.code) {
      setActiveCourse(courseInput); query = query.eq('course_code', courseInput.code); recordCourseActivity(courseInput.code);
    }
    let { data } = await query;
    if (!data || data.length === 0) { const fallback = await supabase.from('questions').select('*').limit(questionLimit * 2); data = fallback.data || []; }
    setQuestions(data.sort(() => 0.5 - Math.random()).slice(0, questionLimit));
    setCurrentIndex(0); setTimeLeft(mode === 'normal' ? 999 : 15); setSelectedOption(null); setIsLocked(false); setScore(0);
    smartSetCurrentView('quiz'); setIsTransitioning(false);
  };

  const openPracticeSetup = (course) => {
    const defaultCourse = processedCoursesList.length > 0 ? processedCoursesList[0] : null;
    setActiveCourse(course || defaultCourse);
    smartSetCurrentView('practice_setup');
  };
  const openShareTopic = (courseCode, topicTitle) => { setShareTarget({ course: courseCode, topic: topicTitle }); smartSetCurrentView('share_topic'); };

  const handleSelect = async (index) => {
    if (isLocked) return;
    setSelectedOption(index); setIsLocked(true);

    if (index === questions[currentIndex]?.correct_option_index) {
      setScore((prev) => prev + 1); const newProg = dailyProgress + 1; setDailyProgress(newProg);
      if (currentUserDbId) supabase.from('profiles').update({ daily_progress: newProg }).eq('id', currentUserDbId).then();
    }
  };

  const handleNextQuestion = async () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1); setTimeLeft(practiceMode === 'normal' ? 999 : 15); setSelectedOption(null); setIsLocked(false);
    } else {
      if (practiceMode === 'ranked' && currentUserDbId) {
        const currentUser = leaderboardData.find(u => u.id === currentUserDbId);
        const currentPoints = currentUser ? (currentUser.points || 0) : 0;
        const newPoints = currentPoints + score;
        setLeaderboardData(prev => prev.map(u => u.id === currentUserDbId ? { ...u, points: newPoints } : u));
        supabase.from('profiles').update({ points: newPoints }).eq('id', currentUserDbId).then();
      }
      smartSetCurrentView('results');
    }
  };

  const topStudents = leaderboardData.filter(user => (user.department || 'Law') === department && (user.level || '300L') === level).slice(0, 3);
  const firstName = (displayName && typeof displayName === 'string') ? displayName.split(' ')[0] : 'Student';

  const globalProps = {
    session, setSession, currentView, setCurrentView: smartSetCurrentView, goBack, activeCourse, setActiveCourse, defaultCourses: processedCoursesList, courses: processedCoursesList,
    topicStatus, readingData, questions, currentIndex, timeLeft, selectedOption, isLocked, score, practiceMode, setPracticeMode, currentUserDbId, displayName, avatarUrl, department, level, bio, leaderboardData, selectedPeer, dailyTarget, dailyProgress, followersCount, followingCount, followingList, isFollowing,
    streakCount, canClaimStreak, streakCalendar, handleImageUpload, handleSaveProfile, handleClaimStreak, handleFollowToggle, handleSignOut, openLeaderboard, viewPeerProfile, openCourseTopics, getCourseMastery, openReadingScreen, markTopicCompleted, startPractice, openPracticeSetup, handleSelect, handleNextQuestion,
    firstName, editName, setEditName, editDepartment, setEditDepartment, editLevel, setEditLevel, editAvatarUrl, setEditAvatarUrl, editBio, setEditBio, isUploading, claimStreak: handleClaimStreak, onClaimStreak: handleClaimStreak, canClaim: canClaimStreak, currentProgress: dailyProgress, topStudents: topStudents, openNetworkView, openNetwork: openNetworkView, networkUsers, isOwnProfileNetwork, openShareTopic,
    handleCompleteOnboarding, isSupported,
    isDarkMode, setIsDarkMode
  };

  const baseMainClasses = ['onboarding', 'edit_profile', 'results', 'followers', 'following', 'admin'].includes(currentView)
    ? 'p-0 pb-24 md:pb-8 bg-white dark:bg-[#121212]'
    : ['reading', 'practice_setup', 'quiz', 'share_topic'].includes(currentView)
      ? 'p-0 bg-white dark:bg-[#121212]'
      : 'p-4 pb-28 md:p-8 md:pb-8';

  if (publicData.isPublic) return <PublicShareView course={publicData.course} topic={publicData.topic} />;

  if (isLoading && currentView === 'dashboard') {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#f8fafc] dark:bg-[#0a0a0a] touch-none overscroll-none z-[9999]">
        <GlobalStyles />
        <div className="transform scale-[0.4] origin-center"><HamsterLoader /></div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="fixed inset-0 h-[100dvh] w-full overflow-y-auto scrollable-content bg-white dark:bg-[#0a0a0a]">
        <GlobalStyles />
        <Auth {...globalProps} />
      </div>
    );
  }

  if (!isOnboarded || currentView === 'onboarding') {
    return (
      <div className="fixed inset-0 h-[100dvh] w-full overflow-y-auto scrollable-content bg-white dark:bg-[#0a0a0a]">
        <GlobalStyles />
        <Onboarding {...globalProps} />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex flex-col h-[100dvh] w-full bg-white dark:bg-[#0a0a0a] overflow-hidden text-[#1A1A1A] dark:text-white font-sans">
      <GlobalStyles />

      {isTransitioning && (
        <div className="fixed inset-0 z-[9999] bg-white/70 dark:bg-[#0a0a0a]/70 backdrop-blur-sm flex items-center justify-center touch-none overscroll-none">
          <div className="transform scale-[0.4] origin-center"><HamsterLoader /></div>
        </div>
      )}

      <div className="flex-1 flex flex-row min-w-0 h-full w-full overflow-hidden">
        {isSupported && (
          <div className="hidden md:block h-full shrink-0 border-r border-[#E5E5E5] dark:border-gray-800 z-40 bg-white dark:bg-[#121212] overflow-y-auto scrollable-content">
            <Sidebar {...globalProps} />
          </div>
        )}

        <div className="flex-1 flex flex-col h-full w-full relative overflow-hidden bg-[#f8fafc] dark:bg-[#0a0a0a]">
          {!['onboarding'].includes(currentView) && (
            <header className="flex-none shrink-0 bg-white/90 dark:bg-[#121212]/90 backdrop-blur-md border-b border-[#E5E5E5] dark:border-gray-800 px-4 md:px-8 py-4 flex items-center justify-between shadow-sm z-50 touch-none select-none">
              <button onClick={goBack} disabled={viewHistory.length === 0} className={`text-sm font-bold transition-colors flex items-center gap-2 ${viewHistory.length > 0 ? 'text-[#666666] dark:text-gray-400 hover:text-[#1A1A1A] dark:hover:text-white' : 'text-transparent cursor-default select-none'}`}>← Back</button>

              <div className="flex items-center gap-3">
                <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest hidden sm:inline">{activeCourse?.code || 'RECALL'}</span>

                {isSupported && (
                  <button
                    onClick={handleManualRefresh}
                    disabled={isManualRefreshing}
                    className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-[#FF6B00] hover:bg-[#FFF2EC] dark:hover:bg-gray-800 rounded-full transition-colors focus:outline-none disabled:opacity-50"
                    title="Refresh Data"
                  >
                    <svg className={`w-4 h-4 ${isManualRefreshing ? 'animate-spin text-[#FF6B00]' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                )}

                <div className="px-3 py-1.5 bg-[#FFF2EC] dark:bg-gray-800 text-[#FF6B00] text-xs font-extrabold rounded-full border border-[#FFD5C2] dark:border-gray-700">🔥 {streakCount}</div>
              </div>
            </header>
          )}

          <main className="flex-1 w-full relative flex flex-col min-h-0 bg-[#f8fafc] dark:bg-[#0a0a0a]">
            <PullToRefresh onRefresh={handleManualRefresh} scrollRef={mainScrollRef} className={baseMainClasses}>
              {currentView === 'dashboard' && <Dashboard {...globalProps} />}
              {currentView === 'courses' && <CourseLibrary {...globalProps} />}
              {currentView === 'course_topics' && <CourseTopics {...globalProps} />}
              {currentView === 'reading' && <Reading {...globalProps} />}
              {currentView === 'practice_setup' && <PracticeSetup {...globalProps} />}
              {currentView === 'quiz' && <Quiz {...globalProps} />}
              {currentView === 'leaderboard' && <Leaderboard {...globalProps} />}
              {currentView === 'peer_profile' && <PeerProfile {...globalProps} />}
              {currentView === 'profile' && <Profile {...globalProps} />}
              {currentView === 'edit_profile' && <EditProfile {...globalProps} />}
              {currentView === 'admin' && <AdminDashboard {...globalProps} />}
              {currentView === 'results' && <TestResult {...globalProps} />}
              {currentView === 'followers' && <Followers {...globalProps} />}
              {currentView === 'following' && <Following {...globalProps} />}
              {currentView === 'share_topic' && <ShareTopic {...globalProps} sharedCourse={shareTarget.course} sharedTopic={shareTarget.topic} />}
            </PullToRefresh>
          </main>

          <div className="md:hidden flex-none shrink-0 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-[#121212] pb-[env(safe-area-inset-bottom)] z-[100] touch-none select-none">
            {isSupported ? (
              <MobileNav {...globalProps} />
            ) : (
              <div className="flex justify-around items-center h-16 px-6">
                <button onClick={() => setCurrentView('dashboard')} className={`flex flex-col items-center gap-1 ${currentView === 'dashboard' ? 'text-[#FF6B00]' : 'text-gray-400'}`}>
                  <span className="text-xl">🏠</span>
                  <span className="text-[10px] font-black">Home</span>
                </button>
                <button onClick={() => setCurrentView('profile')} className={`flex flex-col items-center gap-1 ${currentView === 'profile' ? 'text-[#FF6B00]' : 'text-gray-400'}`}>
                  <span className="text-xl">👤</span>
                  <span className="text-[10px] font-black">Profile</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// 🚀 WRAP THE ENTIRE EXPORT IN THE SOUND PROVIDER
export default function App() {
  return (
    <SoundProvider>
      <ErrorBoundary>
        <AppContent />
      </ErrorBoundary>
    </SoundProvider>
  );
}