// src/components/PullToRefresh.jsx
import { useState, useRef } from 'react';

export default function PullToRefresh({ onRefresh, children, className, scrollRef }) {
    const startYRef = useRef(0);
    const [pullDistance, setPullDistance] = useState(0);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const REFRESH_THRESHOLD = 60;
    const MAX_PULL = 100;

    const handleTouchStart = (e) => {
        if (scrollRef.current && scrollRef.current.scrollTop <= 0) {
            startYRef.current = e.touches[0].clientY;
        }
    };

    const handleTouchMove = (e) => {
        if (startYRef.current > 0 && scrollRef.current && scrollRef.current.scrollTop <= 0) {
            const currentY = e.touches[0].clientY;
            const pull = currentY - startYRef.current;
            if (pull > 0) {
                setPullDistance(Math.min(pull * 0.4, MAX_PULL));
            }
        }
    };

    const handleTouchEnd = async () => {
        if (pullDistance >= REFRESH_THRESHOLD && !isRefreshing) {
            setIsRefreshing(true);
            setPullDistance(50);
            await onRefresh();
            setIsRefreshing(false);
        }
        setPullDistance(0);
        startYRef.current = 0;
    };

    const handleTouchCancel = () => {
        setPullDistance(0);
        startYRef.current = 0;
    };

    return (
        <div
            ref={scrollRef}
            className={`h-full w-full overflow-y-auto scrollable-content relative ${className}`}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={handleTouchCancel}
        >
            <div
                className="w-full flex justify-center items-end overflow-hidden transition-all duration-200 ease-out"
                style={{ height: `${pullDistance}px` }}
            >
                <div className="mb-4 flex items-center justify-center gap-2 text-xs font-bold text-gray-400">
                    {isRefreshing ? (
                        <>
                            <div className="animate-spin h-4 w-4 border-2 border-t-transparent border-[#FF6B00] rounded-full"></div>
                            <span className="text-[#FF6B00]">Refreshing...</span>
                        </>
                    ) : pullDistance >= REFRESH_THRESHOLD ? (
                        <span className="text-[#FF6B00]">Release to refresh</span>
                    ) : (
                        <span>↓ Pull to refresh</span>
                    )}
                </div>
            </div>
            <div className="w-full relative min-h-full">
                {children}
            </div>
        </div>
    );
}