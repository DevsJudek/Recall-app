/* eslint-disable */
import { useState, useEffect, useRef } from 'react';
import { useSound } from '../contexts/SoundContext';

// --- CONFIGURATION ---
const GEMINI_API_KEY = "YOUR_GEMINI_API_KEY"; // 🔴 PASTE YOUR KEY HERE

const VOICE_PROFILES = {
    'ng-female': { label: '🇳🇬 Ezinne (NG)', icon: '👩🏾' },
    'ng-male': { label: '🇳🇬 Abeo (NG)', icon: '👨🏾' },
    'uk-female': { label: '🇬🇧 Sonia (UK)', icon: '👩🏼' }
};

export default function Reading({ activeCourse, markTopicCompleted, readingData, topicStatus = {} }) {
    const { playSound } = useSound();
    const [isCompleting, setIsCompleting] = useState(false);

    // --- AI STUDY PARTNER STATE ---
    const [isAiSheetOpen, setIsAiSheetOpen] = useState(false);
    const [highlightedText, setHighlightedText] = useState('');
    const [hasSelection, setHasSelection] = useState(false);

    const [chatHistory, setChatHistory] = useState([
        { role: 'ai', text: "Hi! I'm Atlas, your Recall AI Tutor. Highlight any text in the reading to ask me about it, or just ask a general question about this module!" }
    ]);
    const [chatInput, setChatInput] = useState('');
    const [isAiTyping, setIsAiTyping] = useState(false);
    const chatEndRef = useRef(null);

    // --- 🎧 TEXT-TO-SPEECH (TTS) STATE ---
    const [ttsState, setTtsState] = useState('idle');
    const [activeSectionIndex, setActiveSectionIndex] = useState(-1);
    const [ttsVoiceType, setTtsVoiceType] = useState(() => localStorage.getItem('ttsVoiceType') || 'ng-female');

    const synth = typeof window !== 'undefined' ? window.speechSynthesis : null;

    useEffect(() => {
        const loadVoices = () => { if (synth) synth.getVoices(); };
        if (synth) {
            loadVoices();
            synth.onvoiceschanged = loadVoices;
        }
        return () => { if (synth) synth.cancel(); };
    }, [synth]);


    // 🚀 FIX: ALL DATA VARIABLES MOVED TO THE TOP SO FUNCTIONS CAN USE THEM!
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


    const getBestVoice = (type) => {
        if (!synth) return null;
        const voices = synth.getVoices();
        if (!voices.length) return null;

        if (type === 'ng-female') {
            return voices.find(v => v.name.includes('Ezinne'))
                || voices.find(v => v.lang === 'en-NG' && (v.name.includes('Female') || v.name.includes('Online')))
                || voices.find(v => v.lang === 'en-NG')
                || voices.find(v => v.lang === 'en-GB' && v.name.includes('Female'))
                || voices[0];
        }
        if (type === 'ng-male') {
            return voices.find(v => v.name.includes('Abeo'))
                || voices.find(v => v.lang === 'en-NG' && (v.name.includes('Male') || v.name.includes('Online')))
                || voices.find(v => v.lang === 'en-GB' && v.name.includes('Male'))
                || voices[0];
        }
        if (type === 'uk-female') {
            return voices.find(v => v.name.includes('Sonia'))
                || voices.find(v => v.name.includes('UK English Female'))
                || voices.find(v => v.lang === 'en-GB' && v.name.includes('Female'))
                || voices.find(v => v.lang === 'en-GB')
                || voices[0];
        }
        return voices[0];
    };

    const speakSection = (index, forceVoiceType = null) => {
        if (!synth || !hasData) return;
        if (index >= readingData.length) {
            setTtsState('idle');
            setActiveSectionIndex(-1);
            return;
        }

        const data = readingData[index];
        const rawHtml = data.high_yield_summary !== "N/A" ? `${data.high_yield_summary}. ${data.content_body}` : data.content_body;
        const pureText = rawHtml.replace(/<[^>]*>?/gm, '');
        const textToRead = `${data.subtopic}. ${pureText}`;

        const utterance = new SpeechSynthesisUtterance(textToRead);

        const voiceTypeToUse = forceVoiceType || ttsVoiceType;
        const voice = getBestVoice(voiceTypeToUse);
        if (voice) utterance.voice = voice;

        utterance.rate = 0.95;

        utterance.onstart = () => {
            setActiveSectionIndex(index);
            setTtsState('playing');
            const element = document.getElementById(`subtopic-${index}`);
            if (element) {
                const yOffset = -120;
                const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
                window.scrollTo({ top: y, behavior: 'smooth' });
            }
        };

        utterance.onend = () => speakSection(index + 1);
        utterance.onerror = () => { synth.cancel(); setTtsState('idle'); setActiveSectionIndex(-1); };

        synth.cancel();
        synth.speak(utterance);
    };

    const handlePlayTTS = () => {
        if (!synth) return alert("Text-to-speech is not supported on this browser.");
        if (ttsState === 'paused') {
            synth.resume(); setTtsState('playing');
        } else {
            speakSection(0);
        }
    };

    const handlePauseTTS = () => {
        if (synth) { synth.pause(); setTtsState('paused'); }
    };

    const handleStopTTS = () => {
        if (synth) { synth.cancel(); setTtsState('idle'); setActiveSectionIndex(-1); }
    };

    const cycleVoice = () => {
        const types = ['ng-female', 'ng-male', 'uk-female'];
        const nextVoice = types[(types.indexOf(ttsVoiceType) + 1) % types.length];
        setTtsVoiceType(nextVoice);
        localStorage.setItem('ttsVoiceType', nextVoice);

        if (ttsState === 'playing' || ttsState === 'paused') {
            speakSection(activeSectionIndex, nextVoice);
        }
    };

    useEffect(() => {
        if (chatEndRef.current) chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }, [chatHistory, isAiTyping]);

    useEffect(() => {
        const handleSelection = () => {
            const selection = window.getSelection();
            const text = selection.toString().trim();
            if (text.length > 10) {
                setHighlightedText(text); setHasSelection(true);
            } else {
                setHasSelection(false);
            }
        };
        document.addEventListener('selectionchange', handleSelection);
        return () => document.removeEventListener('selectionchange', handleSelection);
    }, []);

    const handleAskAi = async (customPrompt = null) => {
        const userMessage = customPrompt || chatInput.trim();
        if (!userMessage) return;

        playSound('pop');

        const newHistory = [...chatHistory, { role: 'user', text: userMessage }];
        setChatHistory(newHistory);
        setChatInput('');
        setIsAiTyping(true);
        setIsAiSheetOpen(true);
        setHasSelection(false);
        window.getSelection().removeAllRanges();

        const fullTopicContext = hasData ? readingData.map(data => {
            const cleanContent = data.content_body ? data.content_body.replace(/<[^>]*>?/gm, '') : '';
            return `--- Section: ${data.subtopic} ---\n${cleanContent}`;
        }).join('\n\n') : '';

        const contextText = highlightedText ? `\n\nThe user highlighted this specific text from the module and is asking about it: "${highlightedText}"` : '';

        const systemPrompt = `You are Atlas, Recall AI Tutor. The user is studying a law module on "${rawTopicName}". 
        Here is the complete text of the module they are currently reading:
        ${fullTopicContext}
        ${contextText}
        Keep answers concise, friendly, formatting with emojis and bullet points where helpful. Answer questions based primarily on the module text provided above. Do not give direct answers if it's a quiz, guide them.`;

        try {
            if (GEMINI_API_KEY === "YOUR_GEMINI_API_KEY") {
                setTimeout(() => {
                    setChatHistory([...newHistory, { role: 'ai', text: `*(This is a test response! Paste your Gemini API key in Reading.jsx to make me real!)* \n\nHere is an explanation of what you asked: **${userMessage}**.` }]);
                    setIsAiTyping(false);
                }, 1500);
                return;
            }

            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    system_instruction: { parts: [{ text: systemPrompt }] },
                    contents: [{ role: "user", parts: [{ text: userMessage }] }]
                })
            });

            const data = await response.json();
            const aiText = data.candidates[0].content.parts[0].text;
            setChatHistory([...newHistory, { role: 'ai', text: aiText }]);
        } catch (error) {
            console.error("AI Error:", error);
            setChatHistory([...newHistory, { role: 'ai', text: "Sorry, my brain is offline right now. Check your internet connection or API key!" }]);
        } finally {
            setIsAiTyping(false);
        }
    };

    // 🚀 EARLY RETURN MOVED HERE SO IT DOESN'T BREAK HOOK RULES
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
            const yOffset = -120;
            const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    };

    const LatinMaximsContent = () => (
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

    const centerColumnSpan = allLatinMaxims.length > 0 ? "lg:col-span-6" : "lg:col-span-8";

    return (
        <div className="max-w-[1400px] mx-auto bg-white dark:bg-[#0a0a0a] min-h-screen pb-24 pt-6 relative transition-colors">

            {/* --- 🎧 FLOATING AUDIO CONTROLLER WITH VOICE SELECTOR --- */}
            {ttsState !== 'idle' && (
                <div className="fixed top-20 md:top-6 left-1/2 -translate-x-1/2 z-40 animate-fade-in-up">
                    <div className="bg-white dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-gray-800 shadow-2xl rounded-full px-4 py-2.5 flex items-center gap-3 md:gap-4 transition-colors">

                        <div className="flex items-center gap-2 pr-2 border-r border-gray-200 dark:border-gray-700">
                            <div className="flex items-end gap-0.5 h-4 w-4">
                                <div className={`w-1 bg-[#FF6B00] rounded-t-sm ${ttsState === 'playing' ? 'animate-[bounce_1s_infinite]' : 'h-1'}`} style={{ animationDelay: '0s' }}></div>
                                <div className={`w-1 bg-[#FF6B00] rounded-t-sm ${ttsState === 'playing' ? 'animate-[bounce_1s_infinite]' : 'h-1'}`} style={{ animationDelay: '0.2s' }}></div>
                                <div className={`w-1 bg-[#FF6B00] rounded-t-sm ${ttsState === 'playing' ? 'animate-[bounce_1s_infinite]' : 'h-1'}`} style={{ animationDelay: '0.4s' }}></div>
                            </div>
                        </div>

                        {/* VOICE SELECTOR BUTTON */}
                        <button
                            onClick={cycleVoice}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F8F9FA] dark:bg-[#242424] hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-[10px] md:text-xs font-bold text-[#1A1A1A] dark:text-white transition-colors"
                        >
                            <span>{VOICE_PROFILES[ttsVoiceType].icon}</span>
                            <span className="hidden sm:inline">{VOICE_PROFILES[ttsVoiceType].label}</span>
                        </button>

                        <div className="flex items-center gap-1.5 pl-2 border-l border-gray-200 dark:border-gray-700">
                            {ttsState === 'playing' ? (
                                <button onClick={handlePauseTTS} className="w-8 h-8 flex items-center justify-center bg-gray-100 dark:bg-[#242424] hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full text-sm">⏸</button>
                            ) : (
                                <button onClick={handlePlayTTS} className="w-8 h-8 flex items-center justify-center bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 hover:bg-emerald-200 rounded-full text-sm">▶</button>
                            )}
                            <button onClick={handleStopTTS} className="w-8 h-8 flex items-center justify-center bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400 hover:bg-rose-200 rounded-full text-sm font-bold">✕</button>
                        </div>
                    </div>
                </div>
            )}

            {/* --- AI TRIGGERS --- */}
            <div className={`fixed bottom-28 md:bottom-10 left-1/2 -translate-x-1/2 z-40 transition-all duration-300 ${hasSelection && !isAiSheetOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
                <button
                    onClick={() => { playSound('pop'); setIsAiSheetOpen(true); }}
                    className="bg-[#1A1A1A] dark:bg-white text-white dark:text-[#1A1A1A] px-6 py-3 rounded-xl shadow-2xl font-bold flex items-center gap-2 border border-gray-700 dark:border-gray-200 hover:scale-105 active:scale-95 transition-all"
                >
                    <span className="text-xl">✨</span> Ask Atlas about this
                </button>
            </div>

            <button
                onClick={() => { playSound('pop'); setIsAiSheetOpen(true); }}
                className={`fixed bottom-28 md:bottom-10 right-6 z-40 w-14 h-14 bg-[#FF6B00] rounded-full shadow-[0_8px_30px_rgb(255,107,0,0.4)] flex items-center justify-center text-2xl hover:scale-110 active:scale-95 transition-all duration-300 ${isAiSheetOpen ? 'opacity-0 scale-50 pointer-events-none' : 'opacity-100'}`}
            >
                ✨
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
                            <div className="bg-[#F8F9FA] dark:bg-[#242424] p-3 rounded-2xl mb-3">
                                <p className="text-xs font-bold text-gray-400 dark:text-gray-500 mb-1">Selected Text:</p>
                                <p className="text-sm text-[#1A1A1A] dark:text-white font-medium line-clamp-2 italic">"{highlightedText}"</p>
                            </div>
                            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                                <button onClick={() => handleAskAi(`Explain this simply: "${highlightedText}"`)} className="whitespace-nowrap px-4 py-2 bg-white dark:bg-[#242424] border border-[#E5E5E5] dark:border-gray-700 rounded-full text-xs font-bold text-[#666666] dark:text-gray-300 shadow-sm hover:border-[#FF6B00] dark:hover:border-[#FF6B00] hover:text-[#FF6B00] dark:hover:text-[#FF6B00]">Explain Simply</button>
                                <button onClick={() => handleAskAi(`Summarize this into 2 bullet points: "${highlightedText}"`)} className="whitespace-nowrap px-4 py-2 bg-white dark:bg-[#242424] border border-[#E5E5E5] dark:border-gray-700 rounded-full text-xs font-bold text-[#666666] dark:text-gray-300 shadow-sm hover:border-[#FF6B00] dark:hover:border-[#FF6B00] hover:text-[#FF6B00] dark:hover:text-[#FF6B00]">Summarize</button>
                                <button onClick={() => handleAskAi(`Test my knowledge by asking a multiple choice question about this text: "${highlightedText}"`)} className="whitespace-nowrap px-4 py-2 bg-white dark:bg-[#242424] border border-[#E5E5E5] dark:border-gray-700 rounded-full text-xs font-bold text-[#666666] dark:text-gray-300 shadow-sm hover:border-[#FF6B00] dark:hover:border-[#FF6B00] hover:text-[#FF6B00] dark:hover:text-[#FF6B00]">Quiz Me</button>
                            </div>
                        </div>
                    )}

                    <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollable-content">
                        {chatHistory.map((msg, i) => (
                            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] p-4 rounded-[24px] text-sm leading-relaxed font-medium ${msg.role === 'user'
                                    ? 'bg-[#FF6B00] text-white rounded-br-none shadow-md'
                                    : 'bg-white dark:bg-[#242424] text-[#4B5563] dark:text-gray-300 border border-[#E5E5E5] dark:border-gray-800 rounded-bl-none shadow-sm'
                                    }`}>
                                    {msg.text}
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

                    <div className="flex-none p-4 pb-8 bg-white dark:bg-[#1A1A1A] border-t border-[#E5E5E5] dark:border-gray-800 transition-colors">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={chatInput}
                                onChange={(e) => setChatInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleAskAi()}
                                placeholder="Ask Atlas a question..."
                                className="flex-1 bg-[#F8F9FA] dark:bg-[#242424] border border-[#E5E5E5] dark:border-gray-700 rounded-full px-5 py-3 text-sm font-medium text-[#1A1A1A] dark:text-white focus:outline-none focus:border-[#FF6B00] dark:focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00]"
                            />
                            <button
                                onClick={() => handleAskAi()}
                                disabled={!chatInput.trim() || isAiTyping}
                                className="w-12 h-12 bg-[#FF6B00] text-white rounded-full flex items-center justify-center shadow-md disabled:opacity-50 hover:bg-[#E05D00] transition-colors"
                            >
                                ↑
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- EXISTING READING LAYOUT --- */}
            <div className="flex justify-end items-center px-4 md:px-8 mb-8 mt-2">
                <div className="flex items-center gap-4 md:gap-6 text-xs font-extrabold text-[#666666] dark:text-gray-400">
                    <span className="tracking-widest uppercase hidden md:inline">Est. Read: {readingData.length * 4} Mins</span>

                    {/* 🎧 PLAY AUDIO BUTTON IN THE HEADER */}
                    <button
                        onClick={ttsState === 'playing' ? handlePauseTTS : handlePlayTTS}
                        className={`px-4 py-2 rounded-full border shadow-sm transition-all flex items-center gap-2 ${ttsState !== 'idle' ? 'bg-[#FFF9F5] dark:bg-orange-900/30 text-[#FF6B00] border-[#FFD5C2] dark:border-orange-900/50' : 'bg-white dark:bg-[#1A1A1A] text-[#1A1A1A] dark:text-white border-[#E5E5E5] dark:border-gray-700 hover:border-[#FF6B00]'}`}
                    >
                        <span className="text-base">{ttsState === 'playing' ? '⏸' : '🎧'}</span>
                        {ttsState === 'playing' ? 'Pause' : 'Listen'}
                    </button>

                    <button className="text-lg hover:text-[#FF6B00]">🔖</button>
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
                                    className={`cursor-pointer flex items-center gap-3 transition-colors ${activeSectionIndex === index ? 'text-[#FF6B00]' : 'hover:text-[#FF6B00] dark:hover:text-[#FF6B00]'}`}
                                >
                                    <span className={activeSectionIndex === index ? 'text-[#FF6B00]' : 'text-gray-300 dark:text-gray-600'}>{index + 1}.</span> {data.subtopic}
                                    {activeSectionIndex === index && ttsState === 'playing' && <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B00] animate-pulse"></span>}
                                </li>
                            ))}
                            {allLandmarkCases.length > 0 && (
                                <li
                                    onClick={() => scrollToSection('landmark-cases')}
                                    className="hover:text-[#FF6B00] dark:hover:text-[#FF6B00] cursor-pointer flex items-center gap-3 transition-colors"
                                >
                                    <span className="text-gray-300 dark:text-gray-600">{readingData.length + 1}.</span> Landmark Case Authorities
                                </li>
                            )}
                        </ul>
                        <div className="bg-[#FFF9F5] dark:bg-orange-950/20 border border-[#FFD5C2] dark:border-orange-900/50 rounded-2xl p-5">
                            <h5 className="text-xs font-black text-[#FF6B00] mb-2 flex items-center gap-2">⚡ Quick Recall</h5>
                            <p className="text-xs text-[#666666] dark:text-gray-400 leading-relaxed font-medium">
                                This module counts for approx. <span className="font-bold text-[#1A1A1A] dark:text-white">15% of the final examination.</span>
                            </p>
                        </div>
                    </div>
                </div>

                <div className={centerColumnSpan}>
                    <div className="mb-10">
                        <p className="text-xs font-extrabold text-[#FF6B00] mb-3">
                            {courseCode} {topicNum ? `• Topic ${topicNum}` : '• Module'}
                        </p>
                        <h1 className="text-4xl md:text-5xl font-black text-[#1A1A1A] dark:text-white leading-tight mb-8">
                            {topicTitle}
                        </h1>
                    </div>

                    {readingData.map((data, index) => (
                        <div
                            key={index}
                            id={`subtopic-${index}`}
                            // 🚀 DYNAMIC HIGHLIGHTING FOR TTS
                            className={`scroll-mt-28 mb-12 transition-all duration-500 rounded-3xl ${activeSectionIndex === index ? 'bg-[#FFF9F5]/50 dark:bg-orange-950/10 border border-[#FFD5C2] dark:border-orange-900/30 p-6 md:p-8 -mx-6 md:-mx-8 shadow-sm' : 'border border-transparent p-0'}`}
                        >
                            <h3 className="text-2xl font-bold text-[#1A1A1A] dark:text-white mb-4">{index + 1}. {data.subtopic}</h3>

                            {data.high_yield_summary && data.high_yield_summary !== "N/A" && (
                                <div className={`rounded-2xl p-6 mb-8 border ${activeSectionIndex === index ? 'bg-white dark:bg-[#121212] border-[#FFE8D6] dark:border-orange-900/30' : 'bg-[#F8F9FA] dark:bg-[#1A1A1A] border-[#E5E5E5] dark:border-gray-800'}`}>
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
                            <LatinMaximsContent />
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
                </div>

                {allLatinMaxims.length > 0 && (
                    <div className="lg:col-span-3 hidden lg:block">
                        <div className="bg-[#F8F9FA] dark:bg-[#1A1A1A] rounded-[32px] p-8 border border-[#E5E5E5] dark:border-gray-800 sticky top-28 shadow-sm">
                            <LatinMaximsContent />
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}