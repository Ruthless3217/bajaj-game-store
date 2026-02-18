import { memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

/**
 * Compact, thick protection meter with glowing pill label.
 * No tiny grey numbers — just the bar, label pill, and bold score.
 */
const ProtectionMeter = memo(function ProtectionMeter({ score, maxScore = 100 }) {
    const percentage = useMemo(() => {
        return Math.max(0, Math.min(100, (score / maxScore) * 100));
    }, [score, maxScore]);

    const { color, glowColor, label } = useMemo(() => {
        if (percentage <= 35) {
            return {
                color: '#EF4444',
                glowColor: 'rgba(239, 68, 68, 0.5)',
                label: 'Low',
            };
        }
        if (percentage <= 70) {
            return {
                color: '#FF8C00',
                glowColor: 'rgba(255, 140, 0, 0.5)',
                label: 'Medium',
            };
        }
        return {
            color: '#10B981',
            glowColor: 'rgba(16, 185, 129, 0.5)',
            label: 'High',
        };
    }, [percentage]);

    return (
        <div className="w-full space-y-3">
            {/* Header — Label left, pill + score right */}
            <div className="flex items-center justify-between">
                <span className="text-[0.9375rem] font-bold text-white tracking-wide">
                    Protection Level
                </span>
                <div className="flex items-center gap-3">
                    {/* Glowing pill */}
                    <span
                        className="text-[0.75rem] font-black uppercase tracking-wider px-3 py-1 rounded-full"
                        style={{
                            backgroundColor: color,
                            color: '#fff',
                            boxShadow: `0 0 14px ${glowColor}, 0 0 4px ${glowColor}`,
                        }}
                    >
                        {label}
                    </span>
                    {/* Bold score */}
                    <span className="text-[1.5rem] font-black text-white leading-none">
                        {Math.round(score)}
                    </span>
                </div>
            </div>

            {/* Thick progress bar — 14px height */}
            <div
                className="relative w-full rounded-full overflow-hidden"
                style={{ height: '14px', backgroundColor: 'rgba(255,255,255,0.08)' }}
            >
                <motion.div
                    className="absolute left-0 top-0 h-full rounded-full"
                    style={{
                        backgroundColor: color,
                        boxShadow: `0 0 16px ${glowColor}`,
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.7, ease: 'easeOut' }}
                />
            </div>
        </div>
    );
});

ProtectionMeter.displayName = 'ProtectionMeter';

ProtectionMeter.propTypes = {
    score: PropTypes.number.isRequired,
    maxScore: PropTypes.number,
};

export default ProtectionMeter;
