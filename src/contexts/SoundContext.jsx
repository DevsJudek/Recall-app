import { createContext, useState, useEffect, useContext, useRef } from 'react';
import { createUISFX } from 'uisfx';

const SoundContext = createContext();

export const useSound = () => useContext(SoundContext);

export function SoundProvider({ children }) {
    // Manage Mute State to keep compatibility
    const [isSoundEnabled, setIsSoundEnabled] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('soundEnabled') !== 'false';
        }
        return true;
    });

    const uiRef = useRef(null);

    useEffect(() => {
        if (!uiRef.current && typeof window !== 'undefined') {
            // Initialize uisfx
            uiRef.current = createUISFX({
                pack: 'minimal',
                volume: 0.5,
            });
            // Attempt to unlock early
            uiRef.current.unlock().catch(() => {});
        }
    }, []);

    // Save preference to local storage
    useEffect(() => {
        localStorage.setItem('soundEnabled', isSoundEnabled);
    }, [isSoundEnabled]);

    // Attempt to unlock on any document click, to satisfy browser audio policies
    useEffect(() => {
        const unlockAudio = () => {
             if (uiRef.current) uiRef.current.unlock();
        };
        document.addEventListener('click', unlockAudio, { once: true });
        return () => document.removeEventListener('click', unlockAudio);
    }, []);

    // The universal play function
    const playSound = (type) => {
        if (!isSoundEnabled || !uiRef.current) return;
        
        // Map the old custom keys to uisfx standard semantic cues
        const cueMap = {
            'correct': 'success',
            'wrong': 'error',
            'tap': 'press',
            'success': 'achievement',
            'pop': 'select',
        };
        
        const mappedCue = cueMap[type] || 'select';
        
        try {
            uiRef.current.play(mappedCue);
        } catch (err) {
            console.error("Sound play error:", err);
        }
    };

    return (
        <SoundContext.Provider value={{ isSoundEnabled, setIsSoundEnabled, playSound }}>
            {children}
        </SoundContext.Provider>
    );
}
