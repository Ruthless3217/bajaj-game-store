import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Custom hook for countdown timer with auto-expire behavior.
 *
 * @param {number} duration - Timer duration in seconds
 * @param {Function} onExpire - Callback invoked when timer reaches zero
 * @param {boolean} isActive - Whether the timer should be running
 * @returns {{ timeLeft: number, resetTimer: Function, stopTimer: Function, progress: number }}
 */
export function useTimer(duration, onExpire, isActive) {
    const [timeLeft, setTimeLeft] = useState(duration);
    const intervalRef = useRef(null);
    const onExpireRef = useRef(onExpire);
    const hasExpiredRef = useRef(false);

    // Keep callback ref updated without re-creating interval
    useEffect(() => {
        onExpireRef.current = onExpire;
    }, [onExpire]);

    const clearTimer = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    }, []);

    const stopTimer = useCallback(() => {
        clearTimer();
    }, [clearTimer]);

    const resetTimer = useCallback(() => {
        clearTimer();
        hasExpiredRef.current = false;
        setTimeLeft(duration);
    }, [clearTimer, duration]);

    useEffect(() => {
        if (!isActive) {
            clearTimer();
            return;
        }

        hasExpiredRef.current = false;
        setTimeLeft(duration);

        intervalRef.current = setInterval(() => {
            setTimeLeft((prev) => {
                const next = prev - 1;
                if (next <= 0 && !hasExpiredRef.current) {
                    hasExpiredRef.current = true;
                    clearInterval(intervalRef.current);
                    intervalRef.current = null;
                    // Defer callback to avoid state update during render
                    setTimeout(() => {
                        onExpireRef.current?.();
                    }, 0);
                    return 0;
                }
                return next;
            });
        }, 1000);

        return clearTimer;
    }, [isActive, duration, clearTimer]);

    // Cleanup on unmount
    useEffect(() => {
        return clearTimer;
    }, [clearTimer]);

    const progress = duration > 0 ? (timeLeft / duration) * 100 : 0;

    return { timeLeft, resetTimer, stopTimer, progress };
}

export default useTimer;
