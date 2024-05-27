import { useEffect, useRef } from 'react';

const useSound = (fileName: string) => {
    const soundRef = useRef<HTMLAudioElement | null>(null);

    const src = require("./assets/sounds/" + fileName);

    if (!soundRef.current) {
        soundRef.current = new Audio(src);
    }

    useEffect(() => {
        const audioElement = new Audio(src);
        audioElement.preload = 'auto';

        const handleCanPlayThrough = () => {
            console.log(`Audio loaded: ${src}`);
            soundRef.current = audioElement;
        };

        audioElement.addEventListener('canplaythrough', handleCanPlayThrough);

        return () => {
            audioElement.removeEventListener('canplaythrough', handleCanPlayThrough);
        };
    }, [src]);



    const play = () => {
        const audioElement = soundRef.current;
        if (audioElement) {
            audioElement.play().catch((error) => {
                console.error(`Error playing sound:`, error);
            });
        }
    };

    const stop = () => {
        const audioElement = soundRef.current;
        if (audioElement) {
            audioElement.pause();
            audioElement.currentTime = 0;
        }
    };

    return { play, stop };
};

export default useSound;