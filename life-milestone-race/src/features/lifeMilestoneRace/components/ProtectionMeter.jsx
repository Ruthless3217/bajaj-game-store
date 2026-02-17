import { memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';

/**
 * Animated protection meter bar with color transitions.
 */
const ProtectionMeter = memo(function ProtectionMeter({ score, maxScore = 100 }) {
    const percentage = useMemo(() => {
        return Math.max(0, Math.min(100, (score / maxScore) * 100));
    }, [score, maxScore]);

    const { color, bgColor, label } = useMemo(() => {
        if (percentage <= 35) {
            return { color: '#EF4444', bgColor: 'rgba(239, 68, 68, 0.15)', label: 'Low' };
        }
        if (percentage <= 70) {
            return { color: '#F59E0B', bgColor: 'rgba(245, 158, 11, 0.15)', label: 'Medium' };
        }
        return { color: '#10B981', bgColor: 'rgba(16, 185, 129, 0.15)', label: 'High' };
    }, [percentage]);

    return (
        <div className="w-full space-y-2">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                    <Shield size={14} style={{ color }} />
                    <span className="text-[0.75rem] font-medium text-slate-300">
                        Protection Level
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <span
                        className="text-[0.75rem] font-semibold px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: bgColor, color }}
                    >
                        {label}
                    </span>
                    <span className="text-[0.875rem] font-bold text-white">
                        {Math.round(score)}
                    </span>
                </div>
            </div>

            {/* Track */}
            <div className="meter-track">
                <motion.div
                    className="meter-fill"
                    style={{ backgroundColor: color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.7, ease: 'easeOut' }}
                />
            </div>

            {/* Scale markers */}
            <div className="flex justify-between px-0.5">
                <span className="text-[0.625rem] text-race-muted">0</span>
                <span className="text-[0.625rem] text-race-muted">35</span>
                <span className="text-[0.625rem] text-race-muted">70</span>
                <span className="text-[0.625rem] text-race-muted">100</span>
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
