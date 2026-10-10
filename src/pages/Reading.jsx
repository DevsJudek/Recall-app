/* eslint-disable no-unused-vars */
// src/pages/Reading.jsx
import { useState, useEffect, useRef } from 'react';
import { useSound } from '../contexts/SoundContext';
import FluidOrb from '../components/FluidOrb';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import TopicComments from '../components/TopicComments';

// 🚀 SECURE API CONNECTION
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

const LatinMaximsContent = ({ allLatinMaxims }) => (
    <>
        <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6 lg:mb-8">Extra Notes</h4>
        <div className="mb-8">
            <h5 className="text-sm font-black text-blue-600 dark:text-blue-400 mb-4 lg:mb-5 uppercase tracking-widest">LATIN MAXIMS</h5>
            <div className="space-y-4">
                {allLatinMaxims.map((maximObj, index) => (
                    <div key={index} className="bg-white dark:bg-[#1A1A1A] p-5 rounded-[24px] border border-[#E5E5E5] dark:border-gray-800 shadow-sm">
                        <p className="text-lg font-bold text-blue-600 dark:text-blue-400 mb-2">{maximObj.maxim}</p>
                        <p className="text-[15px] text-gray-500 dark:text-gray-400 italic leading-relaxed">{maximObj.translation}</p>
                    </div>
                ))}
            </div>
        </div>
    </>
);

export default function Reading({ activeCourse, markTopicCompleted, readingData, topicStatus = {} }) {
    const { playSound } = useSound();
    const [isCompleting, setIsCompleting] = useState(false);

    // --- AI STUDY PARTNER STATE ---
    const [isAiSheetOpen, setIsAiSheetOpen] = useState(false);
    const [highlightedText, setHighlightedText] = useState('');
    const [hasSelection, setHasSelection] = useState(false);
    const [cooldown, setCooldown] = useState(0);

    const [chatHistory, setChatHistory] = useState([
        { role: 'ai', text: "Hi! I'm Atlas, your Recall AI Tutor. Highlight any text in the reading to ask me about it, or just ask a general question about this module!" }
    ]);
    const [chatInput, setChatInput] = useState('');
    const [isAiTyping, setIsAiTyping] = useState(false);
    const chatEndRef = useRef(null);

    // --- TTS STATE ---
    const [isAudioLoading, setIsAudioLoading] = useState(false);
    const [audioUrl, setAudioUrl] = useState(null);

    const handlePlayAudio = async () => {
        if (audioUrl) return; // already loaded
        
        setIsAudioLoading(true);
        try {
            const fullTopicContext = (readingData && readingData.length > 0) ? readingData.map(data => {
                const cleanContent = data.content_body ? data.content_body.replace(/<[^>]*>?/gm, '') : '';
                return `Section ${data.subtopic}. ${cleanContent}`;
            }).join('. ') : '';
            
            // Limit characters because Edge-TTS / Serverless functions might timeout on massive texts
            const textToRead = fullTopicContext.substring(0, 4000); 
            
            const response = await fetch('/api/tts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: textToRead, voice: 'en-US-ChristopherNeural' })
            });
            
            if (!response.ok) throw new Error('Failed to load audio');
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            setAudioUrl(url);
        } catch (e) {
            console.error('Audio load error:', e);
            alert("Failed to load audio for this module.");
        } finally {
            setIsAudioLoading(false);
        }
    };

    // 🚀 DATA VARIABLES
    const hasData = readingData && readingData.length > 0;
    const courseCode = activeCourse?.code || (hasData ? readingData[0].course_code : "BUL 301");
    const rawTopicName = hasData ? readingData[0].topic : "01 Nature of Agency";
    const topicMatch = rawTopicName.match(/^(\d+)\s+(.*)$/);
    const topicNum = topicMatch ? topicMatch[1] : "";
    const topicTitle = topicMatch ? topicMatch[2] : rawTopicName;
    const topicKey = `${courseCode}_${rawTopicName}`;
    const isAlreadyCompleted = topicStatus[topicKey] === 'COMPLETED';

    const allLandmarkCases = readingData?.reduce((acc, curr) => {
        if (curr.landmark_authorities && curr.landmark_authorities !== "N/A") acc.push(...curr.landmark_authorities.split('||'));
        return acc;
    }, []) || [];

    const allLatinMaxims = readingData?.reduce((acc, curr) => {
        if (curr.latin_maxims && Array.isArray(curr.latin_maxims)) acc.push(...curr.latin_maxims);
        return acc;
    }, []) || [];

    // --- EFFECTS ---

    // 🚀 ONLY auto-scroll down when the AI is currently typing a new message.
    useEffect(() => {
        if (isAiTyping && chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [isAiTyping]);

    useEffect(() => {
        let timer;
        if (cooldown > 0) {
            timer = setTimeout(() => setCooldown(prev => prev - 1), 1000);
        }
        return () => clearTimeout(timer);
    }, [cooldown]);

    useEffect(() => {
        const handleSelection = () => {
            const selection = window.getSelection();
            const text = selection.toString().trim();
            if (text.length > 10) {
                setHighlightedText(text);
                setHasSelection(true);
            } else {
                setHasSelection(false);
            }
        };
        document.addEventListener('selectionchange', handleSelection);
        return () => document.removeEventListener('selectionchange', handleSelection);
    }, []);

    const handleOpenAiSheet = () => {
        playSound('pop');
        if (!hasSelection) {
            setHighlightedText('');
        }
        if (window.getSelection) {
            window.getSelection().removeAllRanges();
        }
        setIsAiSheetOpen(true);
    };

    // --- GROQ AI HANDLER ---
    const handleAskAi = async () => {
        const userMessage = chatInput.trim();
        if (!userMessage || cooldown > 0) return;

        playSound('pop');

        const newHistory = [...chatHistory, { role: 'user', text: userMessage }];
        setChatHistory(newHistory);
        setChatInput('');
        setIsAiTyping(true);
        setIsAiSheetOpen(true);
        setHasSelection(false);
        if (window.getSelection) window.getSelection().removeAllRanges();

        if (!GROQ_API_KEY) {
            setChatHistory([...newHistory, { role: 'ai', text: "I can't connect to my brain. Please make sure your VITE_GROQ_API_KEY is set in your .env file!" }]);
            setIsAiTyping(false);
            return;
        }

        const fullTopicContext = hasData ? readingData.map(data => {
            const cleanContent = data.content_body ? data.content_body.replace(/<[^>]*>?/gm, '') : '';
            return `--- Section: ${data.subtopic} ---\n${cleanContent}`;
        }).join('\n\n') : '';

        const contextText = highlightedText ? `\n\nThe user highlighted this specific text from the module and is asking about it: "${highlightedText}"` : '';

        // 🚀 PROMPT UPDATED: Absolutely banned tables. Forced to use lists instead.
        const systemPrompt = `You are Atlas, Recall AI Tutor. The user is studying a law module on "${rawTopicName}". 
        Here is the complete text of the module they are currently reading:
        ${fullTopicContext}
        ${contextText}
        Keep answers concise, friendly, and highly organized. Use bullet points and bold text for emphasis. ABSOLUTELY DO NOT use Markdown tables. Tables are strictly forbidden. If you need to compare concepts, use bullet points or numbered lists instead. Answer questions based primarily on the module text provided above. Do not give direct answers if it's a quiz, guide them.`;

        try {
            const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${GROQ_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: "openai/gpt-oss-120b",
                    messages: [
                        { role: "system", content: systemPrompt },
                        { role: "user", content: userMessage }
                    ],
                    temperature: 0.7,
                    max_tokens: 800
                })
            });

            if (response.status === 429) {
                throw new Error("Whoa, you're too fast! My brain needs a quick 60-second break to process all this law to avoid overheating. Please wait a moment and try again.");
            }

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error?.message || "Unknown Groq API Error");
            }

            const aiText = data.choices[0].message.content;
            setChatHistory([...newHistory, { role: 'ai', text: aiText }]);
            setCooldown(20);

        } catch (error) {
            console.error("AI Error:", error);
            setChatHistory([...newHistory, { role: 'ai', text: error.message }]);
            setCooldown(10);
        } finally {
            setIsAiTyping(false);
            setHighlightedText('');
        }
    };

    if (!hasData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0a0a0a]">
                <div className="text-[#FF6B00] font-bold text-xl animate-pulse">Loading Module...</div>
            </div>
        );
    }

    const handleComplete = () => {
        if (isAlreadyCompleted) return;
        setIsCompleting(true);
        setTimeout(() => { markTopicCompleted(activeCourse, rawTopicName); setIsCompleting(false); }, 600);
    };

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };



    const centerColumnSpan = allLatinMaxims.length > 0 ? "lg:col-span-6" : "lg:col-span-8";

    return (
        <div className="max-w-[1400px] mx-auto bg-white dark:bg-[#0a0a0a] min-h-screen pb-24 pt-6 relative transition-colors">

            {/* FLUID ORB BUTTON */}
            <button
                onClick={handleOpenAiSheet}
                className={`fixed bottom-6 md:bottom-10 right-6 z-40 rounded-full shadow-[0_8px_30px_rgb(255,107,0,0.5)] flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-300 overflow-hidden ${isAiSheetOpen ? 'opacity-0 scale-50 pointer-events-none' : 'opacity-100'}`}
                style={{ padding: 0, border: 'none', background: 'transparent', width: '60px', height: '60px' }}
            >
                <FluidOrb size={60} color="#FF6B00" />
            </button>


            {/* --- AI BOTTOM SHEET --- */}
            <div className={`fixed inset-0 z-[9999] pointer-events-none ${isAiSheetOpen ? 'visible' : 'invisible'}`}>
                <div
                    className={`absolute inset-0 bg-[#1A1A1A]/40 dark:bg-black/60 backdrop-blur-sm pointer-events-auto transition-opacity duration-300 ${isAiSheetOpen ? 'opacity-100' : 'opacity-0'}`}
                    onClick={() => setIsAiSheetOpen(false)}
                />

                <div className={`absolute bottom-0 inset-x-0 w-full max-w-3xl mx-auto h-[80vh] bg-[#f8fafc] dark:bg-[#121212] rounded-t-[32px] pointer-events-auto shadow-2xl transition-transform duration-300 ease-out flex flex-col ${isAiSheetOpen ? 'translate-y-0' : 'translate-y-full'}`}>
                    <div className="flex-none bg-white dark:bg-[#1A1A1A] rounded-t-[32px] px-6 py-4 border-b border-[#E5E5E5] dark:border-gray-800 flex justify-between items-center relative transition-colors">
                        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full" />
                        <div className="flex items-center gap-2 mt-2">
                            <span className="text-2xl">🧠</span>
                            <div>
                                <h3 className="font-black text-[#1A1A1A] dark:text-white text-lg leading-none">Atlas</h3>
                                <p className="text-[10px] font-black text-[#FF6B00] uppercase tracking-widest mt-1">Recall AI Tutor</p>
                            </div>
                        </div>
                        <button onClick={() => setIsAiSheetOpen(false)} className="w-8 h-8 flex items-center justify-center bg-gray-100 dark:bg-[#242424] text-gray-500 dark:text-gray-400 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 font-bold mt-2">✕</button>
                    </div>

                    {highlightedText && (
                        <div className="flex-none p-4 bg-white dark:bg-[#1A1A1A] border-b border-[#E5E5E5] dark:border-gray-800 transition-colors">
                            <div className="bg-[#F8F9FA] dark:bg-[#242424] p-3 rounded-2xl">
                                <div className="flex justify-between items-start mb-1.5">
                                    <p className="text-xs font-bold text-gray-400 dark:text-gray-500">Selected Text:</p>
                                    <button onClick={() => setHighlightedText('')} className="text-gray-400 hover:text-red-500 transition-colors">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg>
                                    </button>
                                </div>
                                <p className="text-sm text-[#1A1A1A] dark:text-white font-medium line-clamp-2 italic leading-relaxed">"{highlightedText}"</p>
                            </div>
                        </div>
                    )}

                    <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollable-content">
                        {chatHistory.map((msg, i) => (
                            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[90%] md:max-w-[85%] p-4 rounded-[24px] text-sm leading-relaxed font-medium ${msg.role === 'user'
                                    ? 'bg-[#FF6B00] text-white rounded-br-none shadow-md'
                                    : 'bg-white dark:bg-[#242424] text-[#4B5563] dark:text-gray-300 border border-[#E5E5E5] dark:border-gray-800 rounded-bl-none shadow-sm'
                                    }`}>

                                    {msg.role === 'user' ? (
                                        <span className="whitespace-pre-wrap">{msg.text}</span>
                                    ) : (
                                        <ReactMarkdown
                                            remarkPlugins={[remarkGfm]}
                                            components={{
                                                p: ({   node, ...props }) => <p className="mb-3 last:mb-0 leading-relaxed" {...props} />,
                                                strong: ({   node, ...props }) => <strong className="font-bold text-[#111827] dark:text-white" {...props} />,
                                                ul: ({   node, ...props }) => <ul className="list-disc pl-5 mb-3 space-y-1.5" {...props} />,
                                                ol: ({   node, ...props }) => <ol className="list-decimal pl-5 mb-3 space-y-1.5" {...props} />,
                                                li: ({   node, ...props }) => <li className="leading-relaxed" {...props} />,
                                                h1: ({   node, ...props }) => <h1 className="text-lg font-black text-[#111827] dark:text-white mt-4 mb-2" {...props} />,
                                                h2: ({   node, ...props }) => <h2 className="text-base font-black text-[#111827] dark:text-white mt-4 mb-2" {...props} />,
                                                h3: ({   node, ...props }) => <h3 className="text-sm font-black text-[#111827] dark:text-white mt-3 mb-1 uppercase tracking-wider" {...props} />,
                                                blockquote: ({   node, ...props }) => <blockquote className="border-l-4 border-[#FF6B00] pl-3 italic my-3 text-gray-500 dark:text-gray-400" {...props} />,
                                                table: ({   node, ...props }) => (
                                                    <div className="overflow-x-auto my-4 w-full">
                                                        <table className="min-w-full text-left border-collapse border border-[#E5E5E5] dark:border-gray-700 rounded-lg hidden-border" {...props} />
                                                    </div>
                                                ),
                                                thead: ({   node, ...props }) => <thead className="bg-[#F8F9FA] dark:bg-[#1A1A1A] border-b border-[#E5E5E5] dark:border-gray-700" {...props} />,
                                                th: ({   node, ...props }) => <th className="px-4 py-2 font-bold text-[#111827] dark:text-white border-r border-[#E5E5E5] dark:border-gray-700 last:border-r-0" {...props} />,
                                                td: ({   node, ...props }) => <td className="px-4 py-2 border-r border-t border-[#E5E5E5] dark:border-gray-700 last:border-r-0" {...props} />
                                            }}
                                        >
                                            {msg.text}
                                        </ReactMarkdown>
                                    )}
                                </div>
                            </div>
                        ))}
                        {isAiTyping && (
                            <div className="flex justify-start">
                                <div className="bg-white dark:bg-[#242424] border border-[#E5E5E5] dark:border-gray-800 text-[#4B5563] p-4 rounded-[24px] rounded-bl-none shadow-sm flex gap-1">
                                    <span className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" />
                                    <span className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                                    <span className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                                </div>
                            </div>
                        )}
                        <div ref={chatEndRef} />
                    </div>

                    <div className="flex-none p-4 pb-12 md:pb-8 bg-white dark:bg-[#1A1A1A] border-t border-[#E5E5E5] dark:border-gray-800 transition-colors">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={chatInput}
                                onChange={(e) => { setChatInput(e.target.value); playSound('typing'); }}
                                onKeyDown={(e) => e.key === 'Enter' && !isAiTyping && cooldown === 0 && handleAskAi()}
                                placeholder={cooldown > 0 ? `Cooling down for ${cooldown}s...` : "Ask Atlas a question..."}
                                disabled={isAiTyping || cooldown > 0}
                                className="flex-1 bg-[#F8F9FA] dark:bg-[#242424] border border-[#E5E5E5] dark:border-gray-700 rounded-full px-5 py-3 text-sm font-medium text-[#1A1A1A] dark:text-white focus:outline-none focus:border-[#FF6B00] dark:focus:border-[#FF6B00] disabled:opacity-60 transition-all"
                            />
                            <button
                                onClick={handleAskAi}
                                disabled={!chatInput.trim() || isAiTyping || cooldown > 0}
                                className="w-12 h-12 shrink-0 bg-[#FF6B00] text-white rounded-full flex items-center justify-center shadow-md disabled:opacity-50 hover:bg-[#E05D00] transition-colors"
                            >
                                {cooldown > 0 ? (
                                    <span className="text-[11px] font-black">{cooldown}s</span>
                                ) : (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- EXISTING READING LAYOUT --- */}

            {/* 🚀 FIXED: Est Read moved up to the top right! */}
            <div className="flex justify-end items-center px-4 md:px-8 mb-8 mt-2">
                <div className="flex items-center gap-4 md:gap-6 text-xs font-extrabold text-[#666666] dark:text-gray-400">
                    <span className="tracking-widest uppercase">Est. Read: {readingData.length * 4} Mins</span>
                    <button className="text-lg hover:text-[#FF6B00] transition-colors">🔖</button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 px-4 md:px-8">

                <div className="lg:col-span-3 mb-4 lg:mb-0">
                    <div className="lg:sticky lg:top-28">
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Module Outline</h4>
                        <ul className="space-y-5 text-sm font-bold text-[#666666] dark:text-gray-400 mb-12">
                            {readingData.map((data, index) => (
                                <li
                                    key={index}
                                    onClick={() => scrollToSection(`subtopic-${index}`)}
                                    className="cursor-pointer flex items-center gap-3 transition-colors text-gray-500 hover:text-[#FF6B00] dark:text-gray-400 dark:hover:text-[#FF6B00]"
                                >
                                    <span className="text-gray-300 dark:text-gray-600">{index + 1}.</span> {data.subtopic}
                                </li>
                            ))}
                            {allLandmarkCases.length > 0 && (
                                <li
                                    onClick={() => scrollToSection('landmark-cases')}
                                    className="hover:text-[#FF6B00] dark:hover:text-[#FF6B00] cursor-pointer flex items-center gap-3 transition-colors text-gray-500 dark:text-gray-400"
                                >
                                    <span className="text-gray-300 dark:text-gray-600">{readingData.length + 1}.</span> Landmark Case Authorities
                                </li>
                            )}
                        </ul>
                    </div>
                </div>

                <div className={centerColumnSpan}>
                    <div className="mb-10">
                        {/* 🚀 FIXED: Kept Course Tag without Est. Read next to it */}
                        <p className="text-xs font-extrabold text-[#FF6B00] mb-3">
                            {courseCode} {topicNum ? `• Topic ${topicNum}` : '• Module'}
                        </p>

                        <h1 className="text-4xl md:text-5xl font-black text-[#1A1A1A] dark:text-white leading-tight mb-8">
                            {topicTitle}
                        </h1>
                        
                        {/* TTS AUDIO PLAYER */}
                        <div className="mb-8">
                            {!audioUrl ? (
                                <button 
                                    onClick={handlePlayAudio}
                                    disabled={isAudioLoading}
                                    className="px-4 py-2 bg-[#F8F9FA] dark:bg-gray-800 text-[#1A1A1A] dark:text-white rounded-full font-bold text-xs sm:text-sm shadow-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2 border border-gray-200 dark:border-gray-700"
                                >
                                    {isAudioLoading ? (
                                        <>
                                            <svg className="animate-spin h-4 w-4 text-[#FF6B00]" viewBox="0 0 24 24" fill="none">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                                            </svg>
                                            Generating Audio...
                                        </>
                                    ) : (
                                        <>
                                            <span>🔊</span> Read Module (Christopher - US)
                                        </>
                                    )}
                                </button>
                            ) : (
                                <audio controls src={audioUrl} className="w-full max-w-sm rounded-full h-10 shadow-sm" autoPlay />
                            )}
                        </div>
                    </div>

                    {readingData.map((data, index) => (
                        <div
                            key={index}
                            id={`subtopic-${index}`}
                            className="scroll-mt-28 mb-12 rounded-3xl p-0"
                        >
                            <h3 className="text-2xl font-bold text-[#1A1A1A] dark:text-white mb-4">{index + 1}. {data.subtopic}</h3>

                            {data.high_yield_summary && data.high_yield_summary !== "N/A" && (
                                <div className="rounded-2xl p-6 mb-8 border bg-[#F8F9FA] dark:bg-[#1A1A1A] border-[#E5E5E5] dark:border-gray-800">
                                    <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">High-Yield Summary</h5>
                                    <p className="text-sm text-[#666666] dark:text-gray-400 font-medium leading-relaxed italic">
                                        {data.high_yield_summary.replace(/<\/?i>/gi, '')}
                                    </p>
                                </div>
                            )}

                            <div
                                className="text-sm text-[#4B5563] dark:text-gray-300 leading-loose font-medium space-y-6"
                                onContextMenu={(e) => e.preventDefault()}
                                style={{ WebkitTouchCallout: 'none' }}
                                dangerouslySetInnerHTML={{ __html: data.content_body }}
                            />
                        </div>
                    ))}

                    {allLandmarkCases.length > 0 && (
                        <section id="landmark-cases" className="pt-8 scroll-mt-28 border-t border-[#E5E5E5] dark:border-gray-800 mt-12 mb-12">
                            <h3 className="text-xl font-bold text-[#1A1A1A] dark:text-white mb-8">{readingData.length + 1}. Landmark Case Authorities</h3>

                            {allLandmarkCases.map((caseString, index) => {
                                const [caseName, court, text, principle] = caseString.split('|');
                                return (
                                    <div key={index} className="bg-white dark:bg-[#1A1A1A] border border-rose-100 dark:border-rose-900/30 rounded-[24px] p-6 mb-4 shadow-sm relative overflow-hidden">
                                        <div className="flex justify-between items-start mb-4">
                                            <h4 className="font-bold text-[#1A1A1A] dark:text-white">{caseName}</h4>
                                            {court && <span className="text-[9px] font-black text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/20 px-2 py-1 rounded uppercase tracking-widest border border-rose-100 dark:border-rose-900/50">{court}</span>}
                                        </div>
                                        <p className="text-sm text-[#666666] dark:text-gray-400 font-medium leading-relaxed mb-4">"{text}"</p>
                                        {principle && (
                                            <p className="text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/20 inline-block px-3 py-1.5 rounded-lg border border-rose-100 dark:border-rose-900/50">
                                                Principle established: {principle}
                                            </p>
                                        )}
                                    </div>
                                );
                            })}
                        </section>
                    )}

                    {allLatinMaxims.length > 0 && (
                        <div className="block lg:hidden bg-[#F8F9FA] dark:bg-[#1A1A1A] rounded-[32px] p-6 md:p-8 border border-[#E5E5E5] dark:border-gray-800 shadow-sm mb-12 mt-6">
                            <LatinMaximsContent allLatinMaxims={allLatinMaxims} />
                        </div>
                    )}

                    <div className="p-6 bg-[#F8F9FA] dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-gray-800 rounded-[24px] flex flex-col sm:flex-row justify-between items-center gap-6 shadow-sm">
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Topic Progress</p>
                            <p className="text-sm font-bold text-[#1A1A1A] dark:text-white">Finished reading this topic?</p>
                        </div>
                        <button
                            onClick={handleComplete}
                            disabled={isCompleting || isAlreadyCompleted}
                            className={`px-8 py-3.5 rounded-xl text-sm font-bold shadow-md transition-all ${(isCompleting || isAlreadyCompleted)
                                ? 'bg-emerald-500 text-white shadow-emerald-500/20'
                                : 'bg-[#FF6B00] text-white shadow-[#FF6B00]/20 hover:bg-[#E05D00]'
                                }`}
                        >
                            {(isCompleting || isAlreadyCompleted) ? '✓ Completed!' : 'Mark as completed →'}
                        </button>
                    </div>
                    
                    {/* TOPIC COMMENTS SECTION */}
                    <TopicComments 
                        courseCode={activeCourse?.code} 
                        topicId={rawTopicName} 
                        currentUserDbId={currentUserDbId} 
                        displayName={displayName} 
                        avatarUrl={avatarUrl} 
                        session={session} 
                    />
                </div>

                {allLatinMaxims.length > 0 && (
                    <div className="lg:col-span-3 hidden lg:block">
                        <div className="bg-[#F8F9FA] dark:bg-[#1A1A1A] rounded-[32px] p-8 border border-[#E5E5E5] dark:border-gray-800 sticky top-28 shadow-sm">
                            <LatinMaximsContent allLatinMaxims={allLatinMaxims} />
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
} 
