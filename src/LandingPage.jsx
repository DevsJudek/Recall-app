import React, { useEffect, useState, useRef } from 'react';

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
  const [scrolled, setScrolled] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [isDark, setIsDark] = useState(false);

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
      title: "High-yield summaries",
      desc: "Master complex topics with concise, expert-curated notes.",
      icon: <DocumentIcon />,
      img: "/mockups/reading.png"
    },
    {
      title: "Interactive ranked tests",
      desc: "Test your knowledge with exam-style questions under pressure.",
      icon: <ZapIcon />,
      img: "/mockups/quiz.png"
    },
    {
      title: "Climb the leaderboard",
      desc: "Compete with peers and track your progress globally.",
      icon: <TrophyIcon />,
      img: "/mockups/leaderboard.png"
    }
  ];

  return (
    <div className="min-h-screen w-full overflow-x-hidden font-['Manrope',_Arial,_sans-serif] bg-[#f8f9fa] dark:bg-[#0a0a0a] text-gray-900 dark:text-[#F8FAFC] selection:bg-[#FF6B00] selection:text-white transition-colors duration-300">
      
      {/* HEADER */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${scrolled ? 'bg-white/90 dark:bg-[#0a0a0a]/90 backdrop-blur-md border-b border-gray-200 dark:border-white/5' : 'bg-transparent'}`}>
        <div className="flex justify-between items-center py-4 px-6 md:px-12 max-w-[1400px] mx-auto opacity-0 animate-hero-arrive">
          <div className="flex items-center gap-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
            <img src="/mockups/recall-logo.png" alt="Recall Logo" className="w-6 h-6 object-contain" />
            Recall
          </div>
          <nav className="hidden md:flex items-center gap-8 text-[15px] font-medium text-gray-600 dark:text-gray-300">
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
            <button onClick={onLoginClick} className="hidden sm:flex items-center bg-[#FFF2EC] text-[#0a0a0a] px-4 py-2 rounded-lg font-semibold text-[14px] hover:bg-white transition-colors shadow-sm">
              Get Started <ArrowUpRight />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto px-6 md:px-12 pt-24 pb-24 space-y-40">
        
        {/* HERO SECTION */}
        <section className="flex flex-col items-center text-center mt-8">
          <div className="opacity-0 animate-center-arrive max-w-4xl" style={{ animationDelay: '0.1s' }}>
            <p className="text-sm font-semibold tracking-wider text-[#FF6B00] uppercase mb-6">Interactive Study & Quiz Platform</p>
            <h1 className="text-[48px] md:text-[80px] leading-[1.05] font-[550] mb-8 tracking-[-0.04em] text-gray-900 dark:text-white">
              Master your exams.<br />Outperform the curve.
            </h1>
            <p className="text-[18px] md:text-[22px] leading-[1.5] font-medium max-w-2xl mx-auto text-gray-600 dark:text-gray-400 mb-10">
              Your ultimate study companion. Access high-yield summaries, practice with exam-style quizzes, and compete on the leaderboard to secure that A.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-24">
              <button onClick={onLoginClick} className="w-full sm:w-auto flex items-center justify-center bg-[#FFF2EC] text-[#0a0a0a] px-8 py-4 rounded-xl font-bold text-[16px] hover:bg-white transition-colors shadow-lg">
                Start studying for free <ArrowUpRight />
              </button>
            </div>
          </div>

          {/* Hero Mockup Composition */}
          <div className="relative w-full max-w-5xl h-[350px] sm:h-[450px] md:h-[700px] opacity-0 animate-world-arrive mt-4 flex justify-center items-start perspective-1000" style={{ animationDelay: '0.4s' }}>
             
             {/* Left Phone */}
             <div className="absolute left-[-20px] sm:left-0 md:left-[10%] top-8 md:top-12 w-32 sm:w-48 md:w-64 transform -rotate-12 translate-y-12 hover:-translate-y-4 transition-transform duration-700 z-10 animate-float-breathe-delayed">
               <img src="/mockups/courses.png" alt="Courses" className="w-full h-auto object-contain" />
             </div>

             {/* Center Phone */}
             <div className="absolute left-1/2 -translate-x-1/2 top-0 w-44 sm:w-64 md:w-80 transform hover:-translate-y-6 transition-transform duration-700 z-30 animate-float-breathe">
               <img src="/mockups/quiz.png" alt="Quiz" className="w-full h-auto object-contain" />
             </div>

             {/* Right Phone */}
             <div className="absolute right-[-20px] sm:right-0 md:right-[10%] top-16 md:top-24 w-32 sm:w-48 md:w-64 transform rotate-12 translate-y-12 hover:-translate-y-4 transition-transform duration-700 z-20 animate-float-breathe-slow">
               <img src="/mockups/leaderboard.png" alt="Leaderboard" className="w-full h-auto object-contain" />
             </div>
          </div>
        </section>

        {/* FEATURES INTERACTIVE SECTION */}
        <section id="features" className="flex flex-col xl:flex-row gap-16 items-center pt-24 mt-24">
          <div className="flex-1 max-w-xl">
            <FadeIn>
              <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase mb-4 flex items-center gap-2">
                <ZapIcon /> Built for better recall
              </p>
              <h2 className="text-[40px] md:text-[52px] leading-[1.05] font-semibold mb-6 tracking-[-0.03em] text-gray-900 dark:text-white">Everything you need to secure that A.</h2>
            </FadeIn>
            
            <div className="mt-12 space-y-2">
              {features.map((feature, idx) => (
                <FadeIn key={idx} delay={idx * 150}>
                  <div 
                    onClick={() => setActiveFeature(idx)}
                    className={`p-6 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${
                      activeFeature === idx 
                        ? 'bg-white dark:bg-[#1A1412] border-[#FF6B00]/40 shadow-md' 
                        : 'bg-transparent border-transparent hover:border-gray-200 dark:hover:border-gray-800 hover:bg-black/5 dark:hover:bg-white/5'
                    }`}
                  >
                     <div className={activeFeature === idx ? 'text-[#FF6B00]' : 'text-gray-500 dark:text-gray-600'}>
                       {feature.icon}
                     </div>
                     <div>
                       <h3 className={`font-bold mb-1 ${activeFeature === idx ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                         {feature.title}
                       </h3>
                       <p className={`text-sm ${activeFeature === idx ? 'text-[#FF6B00]' : 'text-gray-500 dark:text-gray-600'}`}>
                         {feature.desc}
                       </p>
                     </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
          
          <div className="flex-1 w-full flex justify-center items-center relative">
             <div className="relative w-48 md:w-64 flex items-center justify-center">
               <img src={features[0].img} className="w-full h-auto invisible" aria-hidden="true" />
               {features.map((feature, idx) => (
                 <img 
                   key={idx}
                   src={feature.img} 
                   alt={feature.title} 
                   className={`absolute top-0 left-0 w-full h-full object-contain transition-all duration-700 ${
                     activeFeature === idx ? 'opacity-100 scale-100 z-20' : 'opacity-0 scale-95 translate-y-8 z-0 pointer-events-none'
                   }`} 
                 />
               ))}
             </div>
          </div>
        </section>

        {/* TOPICS SECTION */}
        <section id="courses" className="space-y-12">
          <FadeIn>
            <div className="flex flex-col md:flex-row gap-8 justify-between items-end border-b border-gray-200 dark:border-gray-800 pb-12">
              <h2 className="text-[40px] md:text-[52px] leading-[1.05] font-semibold tracking-[-0.03em] max-w-lg text-gray-900 dark:text-white">Recall is available for Law, Agriculture, Sciences, etc.</h2>
              <p className="text-[18px] text-gray-600 dark:text-gray-400 max-w-sm">Law, Sciences, Arts, and General Studies. Explore hundreds of curated topics tailored to your university curriculum.</p>
            </div>
          </FadeIn>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
            {['Commercial Law', 'Criminal Law', 'Law of Torts', 'Constitutional Law', 'Contract Law', 'GST 101', 'Anatomy', 'Physiology', 'Sociology', 'Jurisprudence', 'Company Law', 'Evidence Law'].map((topic, idx) => (
              <FadeIn key={topic} delay={idx * 50}>
                <div className="group flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-800 hover:bg-white dark:hover:bg-[#1A1412] hover:border-[#FF6B00]/30 transition-all cursor-pointer rounded-xl">
                  <div className="flex items-center gap-3">
                    <DocumentIcon />
                    <span className="font-semibold text-gray-800 dark:text-gray-200 group-hover:text-[#FF6B00] transition-colors">{topic}</span>
                  </div>
                  <ArrowUpRight />
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={400}>
            <button onClick={onLoginClick} className="flex items-center justify-center bg-transparent border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-gray-100 dark:hover:bg-white/5 transition-colors mt-8">
              Explore Library <ArrowUpRight />
            </button>
          </FadeIn>
        </section>

        {/* VALUE PROPS with Hand Mockup */}
        <section className="space-y-24">
          <FadeIn>
            <div className="flex flex-col md:flex-row gap-16">
              <div className="flex-1">
                <h2 className="text-[40px] md:text-[52px] leading-[1.05] font-semibold mb-6 tracking-[-0.03em] text-gray-900 dark:text-white">Study. Practice. Compete.</h2>
              </div>
              <div className="flex-[2]">
                <p className="text-[20px] text-gray-600 dark:text-gray-300 max-w-xl">A complete ecosystem designed to help you absorb knowledge faster and retain it longer.</p>
              </div>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <FadeIn delay={0}>
              <div className="w-12 h-12 rounded-xl bg-white dark:bg-[#1A1412] border border-gray-200 dark:border-gray-800 flex items-center justify-center mb-6"><DocumentIcon /></div>
              <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Study</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">Read through high-yield summaries that cut out the fluff and focus on what's tested.</p>
            </FadeIn>
            <FadeIn delay={150}>
              <div className="w-12 h-12 rounded-xl bg-white dark:bg-[#1A1412] border border-gray-200 dark:border-gray-800 flex items-center justify-center mb-6"><ZapIcon /></div>
              <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Practice</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">Take timed quizzes that simulate the real exam environment and adapt to your weaknesses.</p>
            </FadeIn>
            <FadeIn delay={300}>
              <div className="w-12 h-12 rounded-xl bg-white dark:bg-[#1A1412] border border-gray-200 dark:border-gray-800 flex items-center justify-center mb-6"><TrophyIcon /></div>
              <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Compete</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">Climb the ranks on the global leaderboard and stay motivated by studying with peers.</p>
            </FadeIn>
          </div>

          <div className="flex flex-col xl:flex-row items-center justify-between gap-16 mt-32 relative">
             <div className="flex-1 z-10 max-w-xl">
                <FadeIn>
                  <h2 className="text-[40px] md:text-[56px] leading-[1.05] font-semibold mb-6 tracking-[-0.03em] text-gray-900 dark:text-white">Your pocket<br/>study companion.</h2>
                  <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed mb-10">
                    Study on the go. Whether you're commuting, waiting for a lecture, or relaxing at home, your entire curriculum is right in your pocket. Track your daily streaks and never miss a day of learning.
                  </p>
                  <button onClick={onLoginClick} className="flex items-center justify-center bg-[#FFF2EC] text-[#0a0a0a] px-8 py-4 rounded-xl font-bold text-[16px] hover:bg-white transition-colors shadow-lg w-max">
                    Create your profile <ArrowUpRight />
                  </button>
                </FadeIn>
             </div>
             
             <div className="flex-1 w-full flex justify-center items-center relative">
                <FadeIn delay={200} className="relative w-full max-w-[450px] animate-float-breathe-slow">
                  <img src="/mockups/profile.png" alt="Recall App on Mobile" className="w-full h-auto object-contain transform md:rotate-[-5deg]" />
                  <div className="absolute bottom-[-10px] left-[-20px] right-[-20px] h-48 bg-gradient-to-t from-[#f8f9fa] via-[#f8f9fa]/80 dark:from-[#0a0a0a] dark:via-[#0a0a0a]/80 to-transparent pointer-events-none transform md:rotate-[-5deg]"></div>
                </FadeIn>
             </div>
          </div>
        </section>

        {/* PRICING TABLE */}
        <section id="pricing" className="mt-40 max-w-4xl mx-auto">
          <FadeIn>
            <div className="text-center mb-16">
              <h2 className="text-[40px] md:text-[52px] leading-[1.05] font-semibold tracking-[-0.03em] mb-6 text-gray-900 dark:text-white">Start free.<br/>Unlock Super Recall.</h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg">Master your courses for free, or get Super Recall for unlimited practice.</p>
            </div>
          </FadeIn>
          
          <FadeIn delay={150}>
            <div className="bg-white dark:bg-[#1A1412] border border-gray-200 dark:border-[#2a1a10] rounded-[32px] overflow-hidden shadow-sm dark:shadow-none">
              <div className="p-8 pb-4">
                <h3 className="text-xl font-bold mb-8 text-gray-900 dark:text-white">Compare plans</h3>
              </div>
              <table className="w-full text-left text-[15px]">
                <thead className="text-xs font-semibold text-gray-500 uppercase border-b border-gray-200 dark:border-gray-800">
                  <tr>
                    <th className="font-semibold p-4 pl-8">Features</th>
                    <th className="font-semibold p-4 text-center">Free</th>
                    <th className="font-semibold p-4 text-center">Super Recall</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                  {[
                    ['Access to Library', 'Limited', 'Unlimited'],
                    ['Daily Ranked Tests', '3 / day', 'Unlimited'],
                    ['High-Yield Summaries', 'Limited', 'Full Access'],
                    ['Global Leaderboard', 'Included', 'Included'],
                    ['Detailed Performance Analytics', 'Basic', 'Advanced'],
                    ['Offline Mode', 'No', 'Yes']
                  ].map(([label, free, plus], i) => (
                    <tr key={i} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                      <td className="p-4 pl-8 font-medium text-gray-700 dark:text-gray-300">{label}</td>
                      <td className="p-4 text-center text-gray-500 dark:text-gray-400">{free}</td>
                      <td className="p-4 text-center text-[#FF6B00] font-semibold">{plus}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </FadeIn>
          
          <FadeIn delay={300}>
            <div className="mt-8 flex justify-center">
               <button className="flex items-center justify-center bg-transparent border border-[#FF6B00] text-[#FF6B00] px-8 py-4 rounded-xl font-bold text-[16px] hover:bg-[#FF6B00]/10 transition-colors">
                  View Pricing Details <ArrowUpRight />
               </button>
            </div>
          </FadeIn>
        </section>

        {/* FAQ SECTION */}
        <section className="mt-32 max-w-3xl mx-auto space-y-6">
          <FadeIn>
            <h2 className="text-[40px] md:text-[52px] leading-[1.05] font-semibold tracking-[-0.03em] mb-12 text-gray-900 dark:text-white">Frequently asked questions.</h2>
          </FadeIn>
          
          <div className="divide-y divide-gray-200 dark:divide-gray-800 border-y border-gray-200 dark:border-gray-800">
            {[
              ['What is Recall?', 'Recall is an interactive study platform designed specifically for university students. It provides high-yield notes, exam-style quizzes, and a global leaderboard to help you prepare effectively.'],
              ['Is Recall free to use?', 'Yes! You can sign up and access a limited set of daily quizzes and notes for free. For unlimited access to all courses, analytics, and offline mode, you can upgrade to Super Recall.'],
              ['How do the ranked tests work?', 'Ranked tests simulate real exam conditions under time pressure. Your performance earns you points, which determines your position on the weekly global leaderboard.'],
              ['Can I use Recall offline?', 'Offline access is available for Super Recall members. You can download courses and quizzes to your device and sync your progress when you reconnect to the internet.'],
              ['What courses are available?', 'We currently support a wide range of university-level courses including Law, Medicine, Sciences, and General Studies. We are constantly expanding our library.']
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
        <section className="mt-40 mb-16 flex flex-col items-center text-center">
          <FadeIn className="flex flex-col items-center">
            <div className="flex items-center gap-2 font-bold text-gray-900 dark:text-white mb-8">
               <img src="/mockups/recall-logo.png" alt="Recall Logo" className="w-12 h-12 object-contain" />
            </div>
            <h2 className="text-[40px] md:text-[56px] leading-[1.05] font-semibold tracking-[-0.03em] mb-6 text-gray-900 dark:text-white">
              Ready to secure<br />that A?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg mb-10 max-w-sm">
              Join thousands of students crushing their exams with Recall.
            </p>
            <button onClick={onLoginClick} className="flex items-center justify-center bg-[#FFF2EC] text-[#0a0a0a] px-8 py-4 rounded-xl font-bold text-lg hover:bg-white transition-colors shadow-lg w-max border border-gray-200 dark:border-none">
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
