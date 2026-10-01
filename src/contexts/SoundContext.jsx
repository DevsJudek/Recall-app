// src/contexts/SoundContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';

const SOUND_URLS = {
    correct: 'https://cdn.pixabay.com/download/audio/2021/08/04/audio_0625c1539c.mp3?filename=success-1-6297.mp3',
    wrong: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_79ef94d6e9.mp3?filename=error-126627.mp3',
    tap: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8b81ceeb4.mp3?filename=pop-39222.mp3',
    success: 'https://cdn.pixabay.com/download/audio/2021/08/09/audio_82c2a0142e.mp3?filename=success-fanfare-6776.mp3',
    pop: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_247a8bcab2.mp3?filename=ui-click-43196.mp3',
};

const SoundContext = createContext();

export const useSound = () => useContext(SoundContext);

export function SoundProvider({ children }) {
    const [audios, setAudios] = useState({});

    // Manage Mute State
    const [isSoundEnabled, setIsSoundEnabled] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('soundEnabled') !== 'false';
        }
        return true;
    });

    // Save preference to local storage
    useEffect(() => {
        localStorage.setItem('soundEnabled', isSoundEnabled);
    }, [isSoundEnabled]);

    // Preload sounds efficiently
    useEffect(() => {
        const loadedAudios = {};
        Object.keys(SOUND_URLS).forEach(key => {
            const audio = new Audio(SOUND_URLS[key]);
            audio.volume = 0.5;
            loadedAudios[key] = audio;
        });
        setAudios(loadedAudios);
    }, []);

    // The universal play function
    const playSound = (type) => {
        if (!isSoundEnabled || !audios[type]) return;
        try {
            audios[type].currentTime = 0;
            audios[type].play().catch(e => console.log('Audio blocked by browser:', e));
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