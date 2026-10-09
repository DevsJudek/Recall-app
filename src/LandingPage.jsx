import React, { useEffect, useState, useRef } from 'react';
import { CardSpotlight } from "./components/ui/card-spotlight";
import { TextGenerateEffect } from "./components/ui/text-generate-effect";
import { Spotlight } from "./components/ui/spotlight-new";
import { supabase } from './supabase';

const ArrowUpRight = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 ml-2 shrink-0">
    <path d="M6 18 18 6M6 6h12v12"></path>
  </svg>
);

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-[#FF6B00] shrink-0 mt-0.5">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

const DocumentIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-gray-400">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
    <polyline points="10 9 9 9 8 9"></polyline>
  </svg>
);

const ZapIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-gray-400">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
  </svg>
);

const TrophyIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-gray-400">
    <path d="M8 21h8m-4-4v4m0-18v3m-5-3h10a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-1.5M6 4H4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h1.5m6.5 7a6 6 0 1 0 0-12 6 6 0 0 0 0 12z"></path>
  </svg>
);

const MoonIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
  </svg>
);

const SunIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <circle cx="12" cy="12" r="5"></circle>
    <line x1="12" y1="1" x2="12" y2="3"></line>
    <line x1="12" y1="21" x2="12" y2="23"></line>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
    <line x1="1" y1="12" x2="3" y2="12"></line>
    <line x1="21" y1="12" x2="23" y2="12"></line>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
  </svg>
);

// Fade-in on scroll component
const FadeIn = ({ children, delay = 0, className = "", threshold = 0.1 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold });
    
    const { current } = domRef;
    if (current) observer.observe(current);
    return () => current && observer.unobserve(current);
  }, [threshold]);

  return (
    <div
      ref={domRef}
      className={`transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

export default function LandingPage({ onLoginClick }) {

  const [stats, setStats] = useState({ students: 0, courses: 0, questions: 0 });

  useEffect(() => {
    async function fetchStats() {
      try {
        const [
          { count: studentsCount },
          { count: coursesCount },
          { count: questionsCount }
        ] = await Promise.all([
          supabase.from('profiles').select('*', { count: 'exact', head: true }),
          supabase.from('courses').select('*', { count: 'exact', head: true }),
          supabase.from('questions').select('*', { count: 'exact', head: true })
        ]);
        setStats({
          students: studentsCount || 0,
          courses: coursesCount || 0,
          questions: questionsCount || 0
        });
      } catch (e) {
        console.error('Failed to fetch stats', e);
      }
    }
    fetchStats();
  }, []);

  const [scrolled, setScrolled] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const features = [
    {
      title: "The Exact AOC",
      desc: "Stop wasting time on 500 page textbooks. Get bite sized notes tailored perfectly to your specific exam—from university entrance tests to postgraduate Bar finals.",
      icon: <DocumentIcon />,
      img: "/mockups/reading.png"
    },
    {
      title: "Interactive Ranked Tests",
      desc: "Ditch passive reading. Test your recall under pressure and see if you are actually ready for the exam hall.",
      icon: <ZapIcon />,
      img: "/mockups/quiz.png"
    },
    {
      title: "Climb the Leaderboard",
      desc: "Compete with peers, track your daily streaks, and stay motivated by studying with a community that pushes you.",
      icon: <TrophyIcon />,
      img: "/mockups/leaderboard.png"
    }
  ];

  return (
    <div className="min-h-screen w-full overflow-x-hidden font-['Manrope',_Arial,_sans-serif] bg-[#f8f9fa] dark:bg-[#0a0a0a] text-gray-900 dark:text-[#F8FAFC] selection:bg-[#FF6B00] selection:text-white transition-colors duration-300">
      
      {/* SPOTLIGHT */}
        <div className="hidden dark:block"><Spotlight /></div>

        {/* HEADER */}
      <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-[1100px] px-4 transition-all duration-300">
        <div className={`flex justify-between items-center py-3 px-6 md:px-8 mx-auto opacity-0 animate-hero-arrive relative rounded-[14px] backdrop-blur-lg border transition-all duration-300 ${scrolled ? 'bg-white/70 dark:bg-black/40 border-gray-200/50 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.12)]' : 'bg-white/40 dark:bg-black/20 border-white/20 dark:border-white/5 shadow-lg'}`}>
          <div className="flex items-center gap-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
            <img src="/mockups/recall-logo.png" alt="Recall Logo" className="w-6 h-6 object-contain" />
            Recall
          </div>
          <nav className="hidden md:flex items-center gap-8 text-[15px] font-medium text-gray-600 dark:text-gray-300 absolute left-1/2 -translate-x-1/2">
            <a href="#features" className="hover:text-black dark:hover:text-white transition-colors">Features</a>
            <a href="#courses" className="hover:text-black dark:hover:text-white transition-colors">Courses</a>
            <a href="#pricing" className="hover:text-black dark:hover:text-white transition-colors">Pricing</a>
          </nav>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsDark(!isDark)} 
              className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5"
              aria-label="Toggle theme"
            >
              {isDark ? <SunIcon /> : <MoonIcon />}
            </button>
            <button onClick={onLoginClick} className="text-[15px] font-semibold text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors">Sign In</button>
            <button onClick={onLoginClick} className="hidden sm:flex items-center bg-[#FF6B00] text-white px-4 py-2 rounded-[14px] font-semibold text-[14px] hover:bg-[#E56000] transition-colors shadow-sm">
              Get Started <ArrowUpRight />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto px-6 md:px-12 pt-24 pb-24 space-y-24 md:space-y-32">
        
        {/* HERO SECTION */}
        <section className="flex flex-col items-center text-center mt-8">
          <div className="max-w-4xl">
            <FadeIn delay={100}>
            <div className="flex justify-center items-center gap-2 mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF6B00] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF6B00] shadow-[0_0_8px_#FF6B00]"></span>
                </span>
                <p className="text-[15px] font-medium tracking-tight text-[#FF6B00]">Recall Beta is Live</p>
              </div>
            </FadeIn>
            <FadeIn delay={200}>
              <TextGenerateEffect className="mb-8" words="Read exactly what will drop. <br/> Avoid premium tears." />
            </FadeIn>
            <FadeIn delay={300}>
              <p className="text-[18px] md:text-[22px] leading-[1.5] font-medium max-w-2xl mx-auto text-gray-600 dark:text-gray-400 mb-10">
              Whether you are writing JAMB, surviving your undergrad, or preparing for Law School, stop reading off point. Recall gives you hyper tailored notes mapped perfectly to your exact syllabus, paired with an AI tutor and addictive gamification.
            </p>
            </FadeIn>
            <FadeIn delay={400}>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <button onClick={onLoginClick} className="w-full sm:w-max flex items-center justify-center gap-2 bg-[#FF6B00] text-white px-6 py-3 rounded-[14px] font-medium text-[15px] hover:bg-[#E56000] transition-colors shadow-sm">
                Start studying for free <ArrowUpRight />
              </button>
              
            </div>
            </FadeIn>
          </div>

          {/* Hero Mockup Composition */}
          <div className="relative w-full max-w-5xl h-[350px] sm:h-[450px] md:h-[700px] opacity-0 animate-world-arrive mt-4 flex justify-center items-start perspective-1000" style={{ animationDelay: '0.4s' }}>
             
             {/* Left Phone */}
             <div className="absolute left-[-20px] sm:left-0 md:left-[10%] top-8 md:top-12 w-32 sm:w-48 md:w-64 transform -rotate-12 translate-y-12 hover:-translate-y-4 transition-transform duration-700 z-10">
               <img src="/mockups/courses.png" alt="Courses" className="w-full h-auto object-contain animate-float-breathe-delayed" />
             </div>

             {/* Center Phone */}
             <div className="absolute left-1/2 -translate-x-1/2 top-0 w-44 sm:w-64 md:w-80 transform hover:-translate-y-6 transition-transform duration-700 z-30">
               <img src="/mockups/quiz.png" alt="Quiz" className="w-full h-auto object-contain animate-float-breathe" />
             </div>

             {/* Right Phone */}
             <div className="absolute right-[-20px] sm:right-0 md:right-[10%] top-8 md:top-12 w-32 sm:w-48 md:w-64 transform rotate-12 translate-y-12 hover:-translate-y-4 transition-transform duration-700 z-20">
               <img src="/mockups/reading.png" alt="Reading" className="w-full h-auto object-contain animate-float-breathe-slow" />
             </div>
          </div>
        </section>

        {/* TOPICS SECTION */}
        <section id="courses" className="space-y-12">
          <FadeIn>
            <div className="flex flex-col md:flex-row gap-8 justify-between items-end border-b border-gray-200 dark:border-gray-800 pb-12">
              <h2 className="text-[40px] md:text-[52px] leading-[1.05] font-semibold tracking-[-0.03em] max-w-lg text-gray-900 dark:text-white">Find courses by what <span className="text-[#FF6B00]">you study.</span></h2>
              <p className="text-[18px] text-gray-600 dark:text-gray-400 max-w-sm">Law, Sciences, Arts, and General Studies. Explore hundreds of curated topics built specifically for University Applicants, Undergraduates, and Postgraduate professional exams.</p>
            </div>
          </FadeIn>
          
          
          <FadeIn delay={200}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[1px] bg-gray-200 dark:bg-gray-800 border border-gray-200 dark:border-gray-800 rounded-[24px] overflow-hidden mt-8">
              {['Commercial Law', 'Criminal Law', 'Law of Torts', 'Legal System', 'Contract', 'Constitutional Law'].map((topic, idx) => (
                <div key={topic} className="flex items-center p-6 md:p-8 bg-[#f8f9fa] dark:bg-[#0a0a0a]">
                  <div className="flex items-center gap-4">
                    <div className="text-gray-400">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path><line x1="9" y1="10" x2="15" y2="10"></line><line x1="9" y1="14" x2="15" y2="14"></line></svg>
                    </div>
                    <span className="font-medium text-[17px] text-gray-900 dark:text-gray-100">{topic}</span>
                  </div>
                </div>
              ))}
            </div>
          </FadeIn>

          <FadeIn delay={400}>
            <button onClick={onLoginClick} className="flex items-center gap-2 bg-transparent border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white px-6 py-3 rounded-[14px] font-medium text-[15px] hover:bg-gray-100 dark:hover:bg-white/5 transition-colors mt-8 w-max">
              Explore 100 topics <ArrowUpRight size={18} />
            </button>
          </FadeIn>
        </section>

        {/* VALUE PROPS with Hand Mockup */}
        <section className="space-y-24">
          <FadeIn>
            <div className="flex flex-col md:flex-row gap-16">
              <div className="flex-1">
                <h2 className="text-[40px] md:text-[52px] leading-[1.05] font-semibold mb-6 tracking-[-0.03em] text-gray-900 dark:text-white">Study right. Test yourself. <span className="text-[#FF6B00]">Dominate.</span></h2>
              </div>
              <div className="flex-[2]">
                <p className="text-[20px] text-gray-600 dark:text-gray-300 max-w-xl">A complete study ecosystem designed to cut out the fluff and save you from the night before panic. Scattered handouts, missing PDFs, and unorganized Google Drive links are now a thing of the past.</p>
              </div>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <FadeIn delay={0}>
              <div className="w-[52px] h-[52px] rounded-[16px] bg-gray-100 dark:bg-[#1a1a1a] flex items-center justify-center mb-6"><DocumentIcon /></div>
              <h3 className="text-[22px] font-semibold tracking-[-0.01em] mb-3 text-gray-900 dark:text-white">Study</h3>
              <p className="text-[15px] text-gray-600 dark:text-gray-400 leading-[1.6]">Read through course notes that cut out the noise and focus strictly on what is tested.</p>
            </FadeIn>
            <FadeIn delay={150}>
              <div className="w-[52px] h-[52px] rounded-[16px] bg-gray-100 dark:bg-[#1a1a1a] flex items-center justify-center mb-6"><ZapIcon /></div>
              <h3 className="text-[22px] font-semibold tracking-[-0.01em] mb-3 text-gray-900 dark:text-white">Practice</h3>
              <p className="text-[15px] text-gray-600 dark:text-gray-400 leading-[1.6]">Take timed quizzes that simulate the real exam environment and adapt to your knowledge gaps.</p>
            </FadeIn>
            <FadeIn delay={300}>
              <div className="w-[52px] h-[52px] rounded-[16px] bg-gray-100 dark:bg-[#1a1a1a] flex items-center justify-center mb-6"><TrophyIcon /></div>
              <h3 className="text-[22px] font-semibold tracking-[-0.01em] mb-3 text-gray-900 dark:text-white">Compete</h3>
              <p className="text-[15px] text-gray-600 dark:text-gray-400 leading-[1.6]">Climb the ranks on the localized leaderboard, secure bragging rights, and challenge course mates to private rooms.</p>
            </FadeIn>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-16 mt-32 relative">
             <div className="flex-1 z-10 max-w-xl">
                <FadeIn>
                  <h2 className="text-[40px] md:text-[56px] leading-[1.05] font-semibold mb-6 tracking-[-0.03em] text-gray-900 dark:text-white">The ultimate night before<br/><span className="text-[#FF6B00]">lifesaver.</span></h2>
                  <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed mb-10">
                    Forgot a handout or past question? No problem. Your entire curriculum—from foundational courses to advanced postgraduate materials—is perfectly organized right in your pocket. Track your streaks, hit your target, and never study blindly again.
                  </p>
                  <button onClick={onLoginClick} className="w-max flex items-center justify-center gap-2 bg-[#FF6B00] text-white px-6 py-3 rounded-[14px] font-medium text-[15px] hover:bg-[#E56000] transition-colors shadow-sm">
                    Create your profile <ArrowUpRight />
                  </button>
                </FadeIn>
             </div>
             
             <div className="flex-1 w-full flex justify-center items-center relative">
                <FadeIn delay={200} className="relative w-full max-w-[450px] animate-float-breathe-slow">
                  <img src="/mockups/profile.png" alt="Recall App on Mobile" className="w-full h-auto object-contain transform md:rotate-[-5deg]" />
                  <div className="absolute bottom-[-20px] left-[-20px] right-[-20px] h-[60%] bg-gradient-to-t from-[#f8f9fa] via-[#f8f9fa]/95 dark:from-[#0a0a0a] dark:via-[#0a0a0a]/95 to-transparent pointer-events-none transform md:rotate-[-5deg]"></div>
                </FadeIn>
             </div>
          </div>
        </section>

        {/* PRICING TABLE */}
        
          <section id="pricing" className="max-w-5xl mx-auto mt-32">
            <FadeIn>
              <div className="flex flex-col md:flex-row gap-16 items-start">
                <div className="flex-1">
                  <h2 className="text-[40px] md:text-[52px] leading-[1.05] font-semibold mb-6 tracking-[-0.03em] text-gray-900 dark:text-white">Start free.<br/>Do more with <span className="text-[#FF6B00]">Super Recall.</span></h2>
                </div>
                <div className="flex-[1.2]">
                  <p className="text-[18px] text-gray-600 dark:text-gray-400">Join thousands of students and start studying for free. Super Recall gives you full access to unlimited practice and explanations to maximize your grades.</p>
                </div>
              </div>
            </FadeIn>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-16">
              <FadeIn delay={200}>
                <div className="p-10 md:p-12 rounded-[32px] bg-[#f8f9fa] dark:bg-[#0f0f0f] flex flex-col h-full relative border-none">
                  <div className="text-[11px] font-bold tracking-[0.15em] uppercase text-gray-500 mb-8">Free</div>
                  <div className="text-[64px] font-medium leading-none tracking-[-0.04em] text-gray-900 dark:text-white mb-2 relative z-20">₦0</div>
                  <div className="text-[14px] font-medium text-gray-500 mb-6">Start here</div>
                  <div className="text-[14px] leading-[1.6] text-gray-600 dark:text-gray-400 mb-10 max-w-[280px]">Study basic topics, track your simple streaks, and compete on the global leaderboard.</div>
                  
                  <ul className="space-y-4 mb-20 flex-1 relative z-20">
                    {['Limited high yield summaries', '3 daily ranked tests', 'Basic performance analytics', 'Global leaderboard access', 'Standard community support'].map(feature => (
                      <li key={feature} className="flex gap-4 items-start text-[14px] text-gray-700 dark:text-gray-400">
                        <svg className="shrink-0 mt-[2px] text-gray-900 dark:text-gray-500" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        <span className="leading-snug">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button onClick={onLoginClick} className="w-fit flex items-center gap-2 bg-transparent border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white px-5 py-2.5 rounded-[12px] font-medium text-[14px] hover:bg-gray-100 dark:hover:bg-white/5 transition-colors mt-auto">
                    Start free <ArrowUpRight size={16} />
                  </button>
                </div>
              </FadeIn>

              <FadeIn delay={300}>
                <CardSpotlight className="p-10 md:p-12 rounded-[32px] bg-gray-100 dark:bg-[#1a1a1a] flex flex-col h-full relative border border-gray-200 dark:border-white/5">
                  <div className="flex items-center justify-between mb-8 relative z-20">
                    <div className="text-[11px] font-bold tracking-[0.15em] uppercase text-gray-500">Super Recall</div>
                    <div className="text-[9px] font-bold tracking-[0.15em] uppercase text-[#FF6B00] border border-[#FF6B00]/30 bg-[#FF6B00]/10 px-3 py-1 rounded-full">Recommended</div>
                  </div>
                  <div className="text-[64px] font-medium leading-none tracking-[-0.04em] text-gray-900 dark:text-white mb-2">₦3,500</div>
                  <div className="text-[14px] font-medium text-gray-500 mb-6 relative z-20">Per semester</div>
                  <div className="text-[14px] leading-[1.6] text-gray-600 dark:text-gray-400 mb-10 max-w-[280px] relative z-20">Unlimited practice, deep explanations, offline mode, and zero restrictions.</div>
                  
                  <ul className="space-y-4 mb-20 flex-1">
                    {['Full access to your class course library', 'Unlimited daily ranked tests', 'Detailed answer explanations', 'Priority community access'].map(feature => (
                      <li key={feature} className="flex gap-4 items-start text-[14px] text-gray-700 dark:text-gray-400">
                        <svg className="shrink-0 mt-[2px] text-gray-900 dark:text-gray-500" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        <span className="leading-snug">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button onClick={onLoginClick} className="w-fit flex items-center gap-2 bg-[#FF6B00] text-white px-5 py-2.5 rounded-[12px] font-medium text-[14px] hover:bg-[#E56000] transition-colors shadow-sm mt-auto relative z-20">
                    Get Super Recall <ArrowUpRight size={16} />
                  </button>
                  <p className="mt-5 text-[12px] text-gray-500 dark:text-gray-500 max-w-[250px] leading-relaxed relative z-20">
                    Offline mode comes with our native Android and iOS builds which will be in development soon.
                  </p>
                </CardSpotlight>
              </FadeIn>
            </div>

            <FadeIn delay={400}>
              <div className="mt-12 bg-[#f8f9fa] dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 rounded-[32px] overflow-hidden">
                <div className="p-8 pb-6 border-b border-gray-200 dark:border-gray-800">
                  <h3 className="text-[17px] font-medium text-gray-900 dark:text-white">Compare plans.</h3>
                </div>
                <table className="w-full text-left text-[14px]">
                  <thead className="text-[13px] font-medium text-gray-500 border-b border-gray-200 dark:border-gray-800">
                    <tr>
                      <th className="font-medium p-4 pl-8 w-1/2">Features</th>
                      <th className="font-medium p-4 text-left">Free</th>
                      <th className="font-medium p-4 text-left">Super Recall</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                    {[
                      ['Access to Library', 'Unlimited', 'Unlimited'],
                      ['Daily Ranked Tests', '3 / day', 'Unlimited'],
                      ['Course notes', 'Limited', 'Full Access'],
                      ['Global Leaderboard', 'Included', 'Included'],
                      ['Performance Analytics', 'Basic', 'Advanced'],
                      ['Atlas AI Tutor', 'No', 'Yes']
                    ].map(([label, free, plus], i) => (
                      <tr key={i} className="hover:bg-white dark:hover:bg-[#141414] transition-colors">
                        <td className="p-4 pl-8 py-5 font-medium text-gray-800 dark:text-gray-200">{label}</td>
                        <td className="p-4 py-5 text-left text-gray-600 dark:text-gray-400 font-medium">{free}</td>
                        <td className="p-4 py-5 text-left text-[#FF6B00] font-semibold">{plus}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </FadeIn>
          </section>

          {/* FAQ SECTION */}
        <section className="max-w-5xl mx-auto mt-32 mb-16 space-y-6">
          <FadeIn>
            <h2 className="text-[40px] md:text-[52px] leading-[1.05] font-semibold tracking-[-0.03em] mb-12 text-gray-900 dark:text-white">Frequently asked questions.</h2>
          </FadeIn>
          
          <div className="divide-y divide-gray-200 dark:divide-gray-800 border-y border-gray-200 dark:border-gray-800">
            {[
              ['What is Recall?', 'Recall is an interactive study platform designed specifically for university students. It provides high yield notes, exam style quizzes, and a global leaderboard to help you prepare effectively.'],
              ['Is Recall free to use?', 'Yes! You can sign up and access a limited set of daily quizzes and notes for free. For unlimited access to all courses, analytics, and offline mode, you can upgrade to Super Recall.'],
              ['How do the ranked tests work?', 'Ranked tests simulate real exam conditions under time pressure. Your performance earns you points, which determines your position on the weekly global leaderboard.'],
              ['Can I use Recall offline?', 'Offline mode will be available natively on our upcoming Android and iOS mobile apps, which will be entering development soon!'],
              ['What courses are available?', 'We currently support a wide range of university level courses including Law, Medicine, Sciences, and General Studies. We are constantly expanding our library.']
            ].map(([q, a], i) => (
              <FadeIn key={i} delay={i * 100}>
                <details className="group py-6 [&_summary::-webkit-details-marker]:hidden cursor-pointer">
                  <summary className="flex items-center justify-between font-bold text-lg text-gray-900 dark:text-gray-200 outline-none">
                    {q}
                    <svg className="w-5 h-5 text-gray-500 group-open:rotate-45 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"></path></svg>
                  </summary>
                  <p className="mt-4 text-gray-600 dark:text-gray-400 leading-relaxed text-[15px]">{a}</p>
                </details>
              </FadeIn>
            ))}
          </div>
        </section>

        {/* CLOSING CTA */}
        <section className="mb-16 flex flex-col items-center text-center">
          <FadeIn className="flex flex-col items-center">
            <div className="flex items-center gap-2 font-bold text-gray-900 dark:text-white mb-8">
               <img src="/mockups/recall-logo.png" alt="Recall Logo" className="w-12 h-12 object-contain" />
            </div>
            <h2 className="text-[40px] md:text-[56px] leading-[1.05] font-semibold tracking-[-0.03em] mb-6 text-gray-900 dark:text-white">
              Ready to pass without<br />the exam week panic?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg mb-10 max-w-sm">
              Join thousands of applicants, students, and professionals dominating their exams with the right materials. Create your account and build your first streak.
            </p>
            <button onClick={onLoginClick} className="w-max flex items-center justify-center gap-2 bg-[#FF6B00] text-white px-6 py-3 rounded-[14px] font-medium text-[15px] hover:bg-[#E56000] transition-colors shadow-sm">
              Get Started <ArrowUpRight />
            </button>
          </FadeIn>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0a0a0a] pt-20 pb-8 px-6 md:px-12 w-full mt-24">
        <FadeIn>
          <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row justify-between gap-16 lg:gap-8 mb-24">
            <div className="max-w-xs">
              <div className="flex items-center gap-2 font-bold text-gray-900 dark:text-white text-xl mb-4">
                <img src="/mockups/recall-logo.png" alt="Recall Logo" className="w-6 h-6 object-contain" />
                Recall
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">Master your exams. Outperform the curve.</p>
            </div>

            <div className="flex flex-wrap gap-12 lg:gap-24">
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white mb-6">Study</h4>
                <nav className="flex flex-col gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Courses</a>
                  <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Quizzes</a>
                  <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Leaderboard</a>
                </nav>
              </div>
              
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white mb-6">Recall</h4>
                <nav className="flex flex-col gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">About Us</a>
                  <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Pricing</a>
                  <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Contact</a>
                </nav>
              </div>

              <div>
                <h4 className="font-bold text-gray-900 dark:text-white mb-6">Legal</h4>
                <nav className="flex flex-col gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Privacy Policy</a>
                  <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Terms of Service</a>
                </nav>
              </div>
            </div>
          </div>
        </FadeIn>
        
        {/* Giant footer logo */}
        <FadeIn delay={200}>
          <div className="max-w-[1400px] mx-auto flex justify-center mb-16 overflow-hidden">
             <h1 className="text-[25vw] font-bold leading-none tracking-tighter text-[#FF6B00]/5 dark:text-[#FF6B00]/10 select-none">Recall</h1>
          </div>
        </FadeIn>

        <FadeIn delay={400}>
          <div className="max-w-[1400px] mx-auto border-t border-gray-200 dark:border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-semibold text-gray-500 dark:text-gray-600">
             <span>© 2026 Recall Interactive Study</span>
          </div>
        </FadeIn>
      </footer>
    </div>
  );
}
