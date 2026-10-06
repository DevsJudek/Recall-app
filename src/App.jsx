// src/App.jsx - Triggering PWA update 9
/* eslint-disable */
import { useState, useEffect, useMemo, useRef, useCallback, Component } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
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
import ManageCourses from './pages/ManageCourses';
import SuggestMaterial from './pages/SuggestMaterial';
import OneSignal from 'react-onesignal';

import HamsterLoader from './components/HamsterLoader';
import PullToRefresh from './components/PullToRefresh';
import PublicShareView from './pages/PublicShareView';
import { SoundProvider, useSound } from './contexts/SoundContext';

class ErrorBoundary extends Component {
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

  useRegisterSW({
    onRegistered(r) { 
      console.log('SW Registered: ', r); 
    },
    onRegisterError(error) { console.log('SW registration error', error); },
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isManualRefreshing, setIsManualRefreshing] = useState(false);
  const [publicData, setPublicData] = useState({ isPublic: false, course: null, topic: null });

  const [isOnboarded, setIsOnboarded] = useState(true);
  const [isSupported, setIsSupported] = useState(true);

  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) return savedTheme === 'dark';
      return false; // Default to light mode for all users
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

  const [isPushEnabled, setIsPushEnabled] = useState(true);

  useEffect(() => {
    OneSignal.init({
      appId: "008c9775-90dc-4631-b1c7-998af18061cd",
      allowLocalhostAsSecureOrigin: true
    }).then(() => {
      if (OneSignal.User && OneSignal.User.PushSubscription) {
        const checkPush = () => Boolean(OneSignal.User.PushSubscription.optedIn && OneSignal.Notifications.permission);
        setIsPushEnabled(checkPush());
        OneSignal.User.PushSubscription.addEventListener("change", () => setIsPushEnabled(checkPush()));
        OneSignal.Notifications.addEventListener("permissionChange", () => setIsPushEnabled(checkPush()));
      }
    });
  }, []);

  const togglePush = async (enable) => {
    try {
      if (enable) {
        const hasPermission = await OneSignal.Notifications.requestPermission();
        
        if (OneSignal.Notifications.permissionNative === 'denied' || !hasPermission) {
          alert("Your browser is blocking notifications. Please click the lock icon in the URL bar (Site Settings) and set Notifications to 'Allow'.");
        }
        
        await OneSignal.User.PushSubscription.optIn();
        
        // Force state update after action
        setIsPushEnabled(Boolean(OneSignal.User.PushSubscription.optedIn && OneSignal.Notifications.permission));
      } else {
        await OneSignal.User.PushSubscription.optOut();
        setIsPushEnabled(false);
      }
    } catch (err) {
      alert("OneSignal Error: " + (err.message || err));
      console.error(err);
    }
  };

  const [currentView, setCurrentView] = useState('dashboard');
  const [viewHistory, setViewHistory] = useState([]);
  const [activeCourse, setActiveCourse] = useState(null);
  const [networkUsers, setNetworkUsers] = useState([]);
  const [isOwnProfileNetwork, setIsOwnProfileNetwork] = useState(true);
  const [shareTarget, setShareTarget] = useState({ course: '', topic: '' });

  const [coursesList, setCoursesList] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [courseLastStudied, setCourseLastStudied] = useState({});

  const [currentSemester, setCurrentSemester] = useState('1st Semester');

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

  useEffect(() => {
    if (currentUserDbId) {
      OneSignal.login(String(currentUserDbId)).catch(e => console.log(e));
    } else {
      OneSignal.logout().catch(e => console.log(e));
    }
  }, [currentUserDbId]);
  const [displayName, setDisplayName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [department, setDepartment] = useState('Law');
  const [level, setLevel] = useState('300L');
  const [campus, setCampus] = useState('Obafemi Awolowo University (OAU)');
  const [bio, setBio] = useState('');
  const [joinDate, setJoinDate] = useState('');

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
  const [lostStreak, setLostStreak] = useState(0);
  const [restoresLeft, setRestoresLeft] = useState(4);

  const [editName, setEditName] = useState('');
  const [editDepartment, setEditDepartment] = useState('Law');
  const [editLevel, setEditLevel] = useState('300L');
  const [editCampus, setEditCampus] = useState('Obafemi Awolowo University (OAU)');
  const [editAvatarUrl, setEditAvatarUrl] = useState(null);
  const [editBio, setEditBio] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const fetchCourses = useCallback(async () => {
    try {
      const { data: settingsData } = await supabase.from('app_settings').select('current_semester').eq('id', 1).single();
      if (settingsData && settingsData.current_semester) {
        setCurrentSemester(settingsData.current_semester);
      }

      const [{ data: coursesData }, { data: readingsData }] = await Promise.all([
        supabase.from('courses').select('*').order('level'),
        supabase.from('module_readings').select('course_code, topic')
      ]);

      const dummyCourses = [
        { id: 901, code: 'BUL 301', title: 'Commercial Law I', level: '300L', department: 'Law', type: 'Main', semester: '1st Semester', is_available: true },
        { id: 902, code: 'JPL 301', title: 'Law of Torts I', level: '300L', department: 'Law', type: 'Main', semester: '1st Semester', is_available: true },
        { id: 903, code: 'PUL 301', title: 'Criminal Law I', level: '300L', department: 'Law', type: 'Main', semester: '1st Semester', is_available: true },
        { id: 904, code: 'BUL 302', title: 'Commercial Law II', level: '300L', department: 'Law', type: 'Main', semester: '2nd Semester', is_available: true },
        { id: 905, code: 'JPL 302', title: 'Law of Torts II', level: '300L', department: 'Law', type: 'Main', semester: '2nd Semester', is_available: true },
        { id: 906, code: 'PUL 302', title: 'Criminal Law II', level: '300L', department: 'Law', type: 'Main', semester: '2nd Semester', is_available: true },
        { id: 907, code: 'BUL 303', title: 'Banking Law I', level: '300L', department: 'Law', type: 'Core Elective', semester: '1st Semester', is_available: true },
        { id: 908, code: 'BUL 305', title: 'Labor Law I', level: '300L', department: 'Law', type: 'Core Elective', semester: '1st Semester', is_available: true },
        { id: 909, code: 'JPL 305', title: 'Family Law I', level: '300L', department: 'Law', type: 'Core Elective', semester: '1st Semester', is_available: true },
        { id: 910, code: 'BUL 304', title: 'Banking Law II', level: '300L', department: 'Law', type: 'Core Elective', semester: '2nd Semester', is_available: true },
        { id: 911, code: 'PUL 304', title: 'Labor Law II', level: '300L', department: 'Law', type: 'Core Elective', semester: '2nd Semester', is_available: true },
        { id: 912, code: 'JPL 304', title: 'Family Law II', level: '300L', department: 'Law', type: 'Core Elective', semester: '2nd Semester', is_available: true },
        { id: 913, code: 'PHL 319', title: 'Philosophy of Law I', units: 3, level: '300L', department: 'Philosophy', type: 'Restricted Elective', semester: '1st Semester', is_available: true },
        { id: 915, code: 'PUB 301', title: 'Public Policy Analysis I', units: 3, level: '300L', department: 'Public Admin', type: 'Restricted Elective', semester: '1st Semester', is_available: true },
        { id: 919, code: 'SEL 001', title: 'Introduction to Law I', level: 'Any', department: 'Law', type: 'Special Elective', semester: '1st Semester', is_available: true },
        { id: 921, code: 'SEH 301', title: 'Humankind and Nutrition', level: 'Any', department: 'Health', type: 'Special Elective', semester: '1st Semester', is_available: true },
        { id: 922, code: 'SEB 304', title: 'Basic Entrepreneurship', level: 'Any', department: 'Business', type: 'Special Elective', semester: '2nd Semester', is_available: true }
      ];

      let allRaw = [...(coursesData || [])];
      dummyCourses.forEach(d => { if (!allRaw.find(c => c.code === d.code)) allRaw.push(d); });

      // 🚀 Aggressive Data Cleaning: Forces the correct mapping even if your DB has dirty/old values
      const dynamicCourses = allRaw.map(c => {
        const courseReadings = readingsData?.filter(r => r.course_code === c.code) || [];
        const uniqueTopics = new Set(courseReadings.map(r => r.topic)).size;

        const code = c.code?.toUpperCase() || '';
        let type = c.type;
        let dept = c.department;
        let semester = c.semester;
        let levelAssigned = c.level;

        // FORCE overrides to fix any dirty database rows
        if (['BUL 301', 'JPL 301', 'PUL 301', 'PUL 201'].includes(code)) {
          type = 'Main'; semester = '1st Semester';
        } else if (['BUL 302', 'JPL 302', 'PUL 302'].includes(code)) {
          type = 'Main'; semester = '2nd Semester';
        } else if (['BUL 303', 'BUL 305', 'JPL 305'].includes(code)) {
          type = 'Core Elective'; semester = '1st Semester';
        } else if (['BUL 304', 'PUL 304', 'JPL 304'].includes(code)) {
          type = 'Core Elective'; semester = '2nd Semester';
        } else if (['PHL 319', 'PUB 301'].includes(code)) {
          type = 'Restricted Elective'; semester = '1st Semester';
        } else if (['PHL 320', 'PUB 302'].includes(code)) {
          type = 'Restricted Elective'; semester = '2nd Semester';
        } else if (['SEL 001', 'SEH 301'].includes(code)) {
          type = 'Special Elective'; semester = '1st Semester';
        } else if (['SEL 002', 'SEB 304'].includes(code)) {
          type = 'Special Elective'; semester = '2nd Semester';
        } else {
          // Apply standard fallback if not hardcoded
          const dummyMatch = dummyCourses.find(d => d.code === code);
          if (dummyMatch) {
            type = type || dummyMatch.type;
            dept = dept || dummyMatch.department;
            semester = semester || dummyMatch.semester;
            levelAssigned = levelAssigned || dummyMatch.level;
          } else {
            type = type || 'Main';
            dept = dept || 'Law';
            if (!semester) {
              if (c.title?.includes(' II') || c.title?.includes('2nd') || code.endsWith('2') || code.endsWith('4') || code.endsWith('6')) {
                semester = '2nd Semester';
              } else {
                semester = '1st Semester';
              }
            }
          }
        }

        // Automatically group to accurate level based on course code if missing
        if (!levelAssigned && code) {
          const match = code.match(/(\d)\d{2}/);
          if (match) {
            levelAssigned = match[1] + '00L';
          }
        }

        return {
          ...c,
          is_available: c.is_available !== false,
          topics_count: uniqueTopics > 0 ? uniqueTopics : (c.topics_count || 5),
          type,
          department: dept,
          semester,
          level: levelAssigned
        };
      });
      setCoursesList(dynamicCourses);
    } catch (e) {
      console.error("Error fetching courses", e);
    }
  }, []);

  const fetchUserData = useCallback(async (activeSession, isSilent = false) => {
    if (!isSilent) setIsLoading(true);
    try {
      const userEmail = activeSession.user.email;
      const authName = activeSession.user.user_metadata?.full_name || 'Student';

      let { data: byEmail } = await supabase.from('profiles').select('*').ilike('email', userEmail).order('id', { ascending: false }).limit(1);
      let userProfile = byEmail?.[0];

      if (!userProfile) {
        const { data: created, error } = await supabase.from('profiles').insert([{
          name: authName, email: userEmail, points: 0, campus: 'OAU',
          avatar: '', bio: '', current_streak: 0, streak: 0, followers_count: 0, following_count: 0, department: 'Law', level: '300L',
          daily_progress: 0, daily_date: new Date().toDateString(), course_progress: {}, course_last_studied: {},
          is_onboarded: false, daily_target: 25, enrolled_courses: []
        }]).select();
        
        if (error || !created || created.length === 0) {
            console.error("Profile creation failed", error);
            // Fallback so the app doesn't crash completely
            userProfile = { id: 0, email: userEmail, name: authName, points: 0, is_onboarded: false };
        } else {
            userProfile = created[0];
        }
      }

      // Non-blocking fetch for leaderboard
      const fetchLeaderboard = async (dept, lvl, uProfile) => {
        const { data: boardData } = await supabase
          .from('profiles')
          .select('id, name, avatar, points, department, level, followers_count, following_count, current_streak, bio, previous_rank, created_at')
          .eq('department', dept)
          .eq('level', lvl)
          .gt('points', 0)
          .order('points', { ascending: false })
          .limit(20);

        if (boardData) {
          const isUserInBoard = boardData.some(u => u.id === uProfile.id);
          let finalBoardData = boardData;
          if (!isUserInBoard && (uProfile.points || 0) > 0) {
            finalBoardData = [...boardData, uProfile];
          }
          setLeaderboardData(finalBoardData.sort((a, b) => b.points - a.points));
        }
      };

      if (userProfile) {
        // Kick off the leaderboard fetch in the background (DO NOT AWAIT)
        fetchLeaderboard(userProfile.department || 'Law', userProfile.level || '300L', userProfile);

        setCurrentUserDbId(userProfile.id);
        setDisplayName(userProfile.name || 'Student');
        setAvatarUrl(userProfile.avatar || null);
        setDepartment(userProfile.department || 'Law');
        setLevel(userProfile.level || '300L');
        setCampus(userProfile.campus || 'Obafemi Awolowo University (OAU)');
        setBio(userProfile.bio || '');

        const createdDate = new Date(activeSession.user.created_at);
        const formattedJoinDate = createdDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        setJoinDate(formattedJoinDate);
        setTopicStatus(userProfile.course_progress || {});
        setCourseLastStudied(userProfile.course_last_studied || {});
        setFollowingCount(userProfile.following_count || 0);
        setFollowersCount(userProfile.followers_count || 0);

        const fetchedEnrolled = Array.isArray(userProfile.enrolled_courses) ? userProfile.enrolled_courses : [];
        setEnrolledCourses(fetchedEnrolled);

        setIsOnboarded(userProfile.is_onboarded);
        setDailyTarget(userProfile.daily_target || 25);

        const checkSupport = (userProfile.department?.toUpperCase() === 'LAW' || userProfile.department === 'Law');
        setIsSupported(checkSupport);

        if (userProfile.is_onboarded === false) {
          setCurrentView('onboarding');
        }


        let actualStreak = userProfile.current_streak || 0;
        let canClaim = true;

        if (userProfile.last_claim_timestamp) {
          const todayDate = new Date(); todayDate.setHours(0, 0, 0, 0);
          const lastClaimDate = new Date(userProfile.last_claim_timestamp); lastClaimDate.setHours(0, 0, 0, 0);
          const diffDays = Math.floor((todayDate.getTime() - lastClaimDate.getTime()) / (1000 * 60 * 60 * 24));

          if (diffDays === 0) {
            if (userProfile.email === 'kolawolejude0@gmail.com' && userProfile.last_claim_timestamp.startsWith('2026-10-04')) {
              canClaim = true;
            } else {
              canClaim = false;
            }
          }
          else if (diffDays > 1) {
            actualStreak = 0; canClaim = true; supabase.from('profiles').update({ current_streak: 0 }).eq('id', userProfile.id).then();
          } else if (diffDays === 1) canClaim = true;
        }

        const currentMonth = new Date().getMonth();
        let restores = userProfile.streak_restores || { count: 4, month: currentMonth };
        if (typeof restores === 'string') restores = JSON.parse(restores);
        if (restores.month !== currentMonth) restores = { count: 4, month: currentMonth };
        
        let lostStrk = 0;
        if (actualStreak === 0 && userProfile.streak > 0) {
          lostStrk = userProfile.streak;
        }

        setLostStreak(lostStrk);
        setRestoresLeft(restores.count);
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
  }, []);

  // 🚀 Derived state: INSTANTLY injects mandatory Main courses for the current view
  const activeEnrolledCourses = useMemo(() => {
    if (!level || !department || coursesList.length === 0) return enrolledCourses;

    const mandatoryMainCodes = coursesList
      .filter(c => c.type === 'Main' && c.level === level && (c.department === department || c.department === 'Law') && c.semester === currentSemester)
      .map(c => c.code);

    return Array.from(new Set([...enrolledCourses, ...mandatoryMainCodes]));
  }, [coursesList, enrolledCourses, level, department, currentSemester]);

  // Silently save them if they are missing
  useEffect(() => {
    if (currentUserDbId && activeEnrolledCourses.length > enrolledCourses.length) {
      setEnrolledCourses(activeEnrolledCourses);
      supabase.from('profiles').update({ enrolled_courses: activeEnrolledCourses }).eq('id', currentUserDbId).then(({ error }) => {
        if (error) console.error('Enrolled update fallback error:', error);
      });
    }
  }, [activeEnrolledCourses, enrolledCourses.length, currentUserDbId]);

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
    const isSupportCheck = (data.department.toUpperCase() === 'LAW');

    let payload = {
      name: data.name,
      department: data.department,
      level: data.level,
      campus: data.institution,
      daily_target: data.dailyTarget,
      is_onboarded: true
    };
    if (data.level !== level || data.department !== department) {
      payload.enrolled_courses = [];
      setEnrolledCourses([]);
    }

    await supabase.from('profiles').update(payload).eq('id', currentUserDbId);


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
    if (!isSupported && ['courses', 'course_topics', 'reading', 'practice_setup', 'quiz', 'leaderboard', 'share_topic', 'manage_courses'].includes(view)) {
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
    setEnrolledCourses([]);
  };

  useEffect(() => {
    if (currentView === 'edit_profile') {
      if (editAvatarUrl && editAvatarUrl !== avatarUrl && editAvatarUrl.includes('/storage/v1/object/public/avatars/')) {
        const orphaned = editAvatarUrl.split('/avatars/')[1];
        if (orphaned) supabase.storage.from('avatars').remove([orphaned]).then();
      }
      setEditName(displayName || ''); setEditDepartment(department || 'Law'); setEditLevel(level || '300L'); setEditCampus(campus || 'Obafemi Awolowo University (OAU)'); setEditAvatarUrl(avatarUrl); setEditBio(bio || '');
    }
   
  }, [currentView, displayName, department, level, avatarUrl, bio, campus]);

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

  // 🚀 Force Library to ONLY show courses for the current app semester
  const processedCoursesList = useMemo(() => {
    return coursesList
      .filter(c => activeEnrolledCourses.includes(c.code) && c.semester === currentSemester)
      .map(c => ({ ...c, last_studied: formatLastStudied(courseLastStudied[c.code]) }));
  }, [coursesList, activeEnrolledCourses, courseLastStudied, currentSemester]);

  const recordCourseActivity = (courseCode) => {
    if (!courseCode) return;
    const now = new Date().toISOString(); const updated = { ...courseLastStudied, [courseCode]: now };
    setCourseLastStudied(updated);
    if (currentUserDbId) supabase.from('profiles').update({ course_last_studied: updated }).eq('id', currentUserDbId).then();
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]; if (!file) return; setIsUploading(true);

    if (editAvatarUrl && editAvatarUrl !== avatarUrl && editAvatarUrl.includes('/storage/v1/object/public/avatars/')) {
      const oldTempFileName = editAvatarUrl.split('/avatars/')[1];
      if (oldTempFileName) supabase.storage.from('avatars').remove([oldTempFileName]).then();
    }

    const fileName = `${currentUserDbId}-${Math.random()}.${file.name.split('.').pop()}`;
    const { error: uploadError } = await supabase.storage.from('avatars').upload(fileName, file);
    if (!uploadError) { const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(fileName); setEditAvatarUrl(publicUrl); }
    setIsUploading(false);
  };

  const handleSaveProfile = async () => {
    if (!currentUserDbId) return;

    if (avatarUrl && avatarUrl !== editAvatarUrl && avatarUrl.includes('/storage/v1/object/public/avatars/')) {
      const oldFileName = avatarUrl.split('/avatars/')[1];
      if (oldFileName) supabase.storage.from('avatars').remove([oldFileName]).then();
    }

    let updatePayload = { name: editName, avatar: editAvatarUrl, department: editDepartment, level: editLevel, bio: editBio, campus: editCampus };
    
    if (editLevel !== level || editDepartment !== department) {
      updatePayload.enrolled_courses = [];
      setEnrolledCourses([]);
    }

    setDisplayName(editName); setAvatarUrl(editAvatarUrl); setDepartment(editDepartment); setLevel(editLevel); setBio(editBio); setCampus(editCampus);
    await supabase.from('profiles').update(updatePayload).eq('id', currentUserDbId);
    await handleManualRefresh();
    smartSetCurrentView('profile');
  };

  const handleClaimStreak = async () => {
    if (!canClaimStreak || !session || !currentUserDbId) return;
    playSound('streak');
    const newStreak = streakCount + 1; const now = new Date().toISOString();
    setStreakCount(newStreak); setCanClaimStreak(false); setLostStreak(0);
    await supabase.from('profiles').update({ current_streak: newStreak, streak: newStreak, last_claim_timestamp: now }).eq('id', currentUserDbId).then();
  };

  const handleRestoreStreak = async () => {
    if (lostStreak === 0 || restoresLeft <= 0 || !session || !currentUserDbId) return;
    playSound('streak');
    const newRestoresLeft = restoresLeft - 1;
    const currentMonth = new Date().getMonth();
    const streakRestoresObj = { count: newRestoresLeft, month: currentMonth };
    
    setStreakCount(lostStreak); 
    setLostStreak(0);
    setRestoresLeft(newRestoresLeft);
    
    await supabase.from('profiles').update({ 
      current_streak: lostStreak, 
      streak_restores: streakRestoresObj 
    }).eq('id', currentUserDbId).then();
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
    else if (timeLeft === 0 && practiceMode === 'ranked' && !isLocked) { setSelectedOption(null); setIsLocked(true); }
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

    let targetCodes = [];
    if (courseInput === 'mixed' || courseInput === null) {
      setActiveCourse(null);
      targetCodes = activeEnrolledCourses;
      if (mode === 'ranked') {
        targetCodes = targetCodes.filter(code => {
          const c = coursesList.find(x => x.code === code);
          return c && c.type !== 'Special Elective';
        });
      }
    } else if (typeof courseInput === 'string') {
      const resolvedCode = courseInput.toUpperCase();
      targetCodes = [resolvedCode];
      setActiveCourse({ code: resolvedCode }); recordCourseActivity(resolvedCode);
    } else if (courseInput && courseInput.code) {
      targetCodes = [courseInput.code];
      setActiveCourse(courseInput); recordCourseActivity(courseInput.code);
    }

    let query = supabase.from('questions').select('*');
    if (targetCodes.length > 0) {
      query = query.in('course_code', targetCodes);
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
    setSelectedOption(index);
  };

  const handleLockAnswer = async () => {
    if (selectedOption === null || isLocked) return;
    setIsLocked(true);

    if (selectedOption === questions[currentIndex]?.correct_option_index) {
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
        setLeaderboardData(prev => {
          const userExists = prev.some(u => u.id === currentUserDbId);
          if (userExists) {
            return prev.map(u => u.id === currentUserDbId ? { ...u, points: newPoints } : u).sort((a, b) => b.points - a.points);
          } else {
            return [...prev, { id: currentUserDbId, name: displayName, avatar: avatarUrl, department, level, points: newPoints }].sort((a, b) => b.points - a.points);
          }
        });
        supabase.from('profiles').update({ points: newPoints }).eq('id', currentUserDbId).then();
      }
      smartSetCurrentView('results');
    }
  };

  const topStudents = leaderboardData.filter(user => (user.department || 'Law') === department && (user.level || '300L') === level).slice(0, 3);
  const firstName = (displayName && typeof displayName === 'string') ? displayName.split(' ')[0] : 'Student';

  const globalProps = {
    session, setSession, currentView, setCurrentView: smartSetCurrentView, goBack, activeCourse, setActiveCourse, defaultCourses: processedCoursesList, courses: processedCoursesList,
    allCourses: coursesList, enrolledCourses: activeEnrolledCourses, setEnrolledCourses, currentSemester,
    topicStatus, readingData, questions, currentIndex, timeLeft, selectedOption, isLocked, score, practiceMode, setPracticeMode, currentUserDbId, displayName, avatarUrl, department, level, bio, joinDate, leaderboardData, selectedPeer, dailyTarget, dailyProgress, followersCount, followingCount, followingList, isFollowing,
    streakCount, canClaimStreak, streakCalendar, handleImageUpload, handleSaveProfile, handleClaimStreak, handleFollowToggle, handleSignOut, openLeaderboard, viewPeerProfile, openCourseTopics, getCourseMastery, openReadingScreen, markTopicCompleted, startPractice, openPracticeSetup, handleSelect, handleLockAnswer, handleNextQuestion, lostStreak, restoresLeft, handleRestoreStreak,
    firstName, editName, setEditName, editDepartment, setEditDepartment, editLevel, setEditLevel, editCampus, setEditCampus, editAvatarUrl, setEditAvatarUrl, editBio, setEditBio, isUploading, claimStreak: handleClaimStreak, onClaimStreak: handleClaimStreak, canClaim: canClaimStreak, currentProgress: dailyProgress, topStudents: topStudents, openNetworkView, openNetwork: openNetworkView, networkUsers, isOwnProfileNetwork, openShareTopic,
    handleCompleteOnboarding, isSupported, isPushEnabled, togglePush,
    isDarkMode, setIsDarkMode, campus

  };

  const baseMainClasses = ['onboarding', 'edit_profile', 'results', 'followers', 'following', 'admin'].includes(currentView)
    ? 'p-0 pb-24 md:pb-8 bg-white dark:bg-[#121212]'
    : ['reading', 'practice_setup', 'quiz', 'share_topic', 'manage_courses'].includes(currentView)
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
              {currentView === 'manage_courses' && <ManageCourses {...globalProps} />}
              {currentView === 'suggest_material' && <SuggestMaterial {...globalProps} onBack={goBack} />}
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

export default function App() {
  return (
    <SoundProvider>
      <ErrorBoundary>
        <AppContent />
      </ErrorBoundary>
    </SoundProvider>
  );
}