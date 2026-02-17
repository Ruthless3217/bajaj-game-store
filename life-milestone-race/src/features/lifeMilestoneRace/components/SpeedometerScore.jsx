import { memo, useMemo, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import Button from '../../../components/ui/Button';

const ARC_RADIUS = 90;
const ARC_STROKE = 10;
const CENTER = 110;
const START_ANGLE = -210;
const END_ANGLE = 30;
const TOTAL_SWEEP = END_ANGLE - START_ANGLE; // 240 degrees

/**
 * Convert polar to Cartesian coordinates.
 */
function polarToCartesian(cx, cy, radius, angleDeg) {
    const angleRad = ((angleDeg - 90) * Math.PI) / 180;
    return {
        x: cx + radius * Math.cos(angleRad),
        y: cy + radius * Math.sin(angleRad),
    };
}

/**
 * Create an SVG arc path.
 */
function describeArc(cx, cy, radius, startAngle, endAngle) {
    const start = polarToCartesian(cx, cy, radius, endAngle);
    const end = polarToCartesian(cx, cy, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

    return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
}

/**
 * Speedometer-style score reveal animation.
 */
const SpeedometerScore = memo(function SpeedometerScore({
    score,
    category,
    onViewTimeline,
}) {
    const [animatedScore, setAnimatedScore] = useState(0);

    // Animate score counting
    useEffect(() => {
        let frame;
        let start;
        const duration = 1500;

        const animate = (timestamp) => {
            if (!start) start = timestamp;
            const elapsed = timestamp - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
            setAnimatedScore(Math.round(score * eased));

            if (progress < 1) {
                frame = requestAnimationFrame(animate);
            }
        };

        frame = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(frame);
    }, [score]);

    const scoreAngle = useMemo(() => {
        return START_ANGLE + (score / 100) * TOTAL_SWEEP;
    }, [score]);

    const trackPath = useMemo(() => {
        return describeArc(CENTER, CENTER, ARC_RADIUS, START_ANGLE, END_ANGLE);
    }, []);

    const fillPath = useMemo(() => {
        if (score <= 0) return '';
        return describeArc(CENTER, CENTER, ARC_RADIUS, START_ANGLE, scoreAngle);
    }, [score, scoreAngle]);

    const needleEnd = useMemo(() => {
        return polarToCartesian(CENTER, CENTER, ARC_RADIUS - 15, scoreAngle);
    }, [scoreAngle]);

    const fillColor = useMemo(() => {
        return category?.color || '#3B82F6';
    }, [category]);

    return (
        <motion.div
            className="w-full flex flex-col items-center gap-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
        >
            {/* Heading */}
            <motion.div
                className="text-center space-y-1"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
            >
                <h2 className="race-heading text-[1.75rem] text-white">Race Complete!</h2>
                <p className="text-race-muted text-[0.875rem]">
                    Your Life Protection Score
                </p>
            </motion.div>

            {/* Speedometer SVG */}
            <div className="relative w-[14rem] h-[10rem]">
                <svg
                    viewBox={`0 0 ${CENTER * 2} ${CENTER * 1.3}`}
                    className="w-full h-full"
                >
                    {/* Background track */}
                    <path
                        d={trackPath}
                        fill="none"
                        stroke="#1E2A45"
                        strokeWidth={ARC_STROKE}
                        strokeLinecap="round"
                    />

                    {/* Score fill - animated */}
                    {fillPath && (
                        <motion.path
                            d={fillPath}
                            fill="none"
                            stroke={fillColor}
                            strokeWidth={ARC_STROKE}
                            strokeLinecap="round"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 1.5, ease: 'easeOut', delay: 0.2 }}
                            style={{ filter: `drop-shadow(0 0 0.5rem ${fillColor}40)` }}
                        />
                    )}

                    {/* Scale marks */}
                    {[0, 35, 70, 100].map((mark) => {
                        const angle = START_ANGLE + (mark / 100) * TOTAL_SWEEP;
                        const outer = polarToCartesian(CENTER, CENTER, ARC_RADIUS + 14, angle);
                        const inner = polarToCartesian(CENTER, CENTER, ARC_RADIUS + 6, angle);
                        const labelPos = polarToCartesian(CENTER, CENTER, ARC_RADIUS + 24, angle);
                        return (
                            <g key={mark}>
                                <line
                                    x1={inner.x}
                                    y1={inner.y}
                                    x2={outer.x}
                                    y2={outer.y}
                                    stroke="#64748B"
                                    strokeWidth={1.5}
                                />
                                <text
                                    x={labelPos.x}
                                    y={labelPos.y}
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                    fill="#64748B"
                                    fontSize="10"
                                    fontFamily="Inter"
                                >
                                    {mark}
                                </text>
                            </g>
                        );
                    })}

                    {/* Needle */}
                    <motion.line
                        x1={CENTER}
                        y1={CENTER}
                        x2={needleEnd.x}
                        y2={needleEnd.y}
                        stroke="white"
                        strokeWidth={2.5}
                        strokeLinecap="round"
                        initial={{ x2: CENTER, y2: CENTER }}
                        animate={{ x2: needleEnd.x, y2: needleEnd.y }}
                        transition={{ duration: 1.5, ease: 'easeOut', delay: 0.2 }}
                    />

                    {/* Center dot */}
                    <circle cx={CENTER} cy={CENTER} r={5} fill="white" />
                </svg>

                {/* Score number overlay */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center">
                    <span className="text-[2.5rem] font-extrabold text-white font-display">
                        {animatedScore}
                    </span>
                </div>
            </div>

            {/* Category badge */}
            <motion.div
                className="text-center space-y-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.5 }}
            >
                <span
                    className="inline-flex items-center px-4 py-2 rounded-full text-[0.9375rem] font-bold"
                    style={{
                        backgroundColor: `${fillColor}20`,
                        color: fillColor,
                        border: `1px solid ${fillColor}40`,
                    }}
                >
                    {category?.label}
                </span>

                <p className="text-race-muted text-[0.8125rem] max-w-xs mx-auto">
                    Life moves faster than planning. Let&apos;s strengthen your protection.
                </p>
            </motion.div>

            {/* CTA */}
            <motion.div
                className="w-full max-w-xs"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5, duration: 0.5 }}
            >
                <Button
                    variant="primary"
                    size="lg"
                    className="w-full"
                    onClick={onViewTimeline}
                    id="btn-view-timeline"
                >
                    View Your Journey
                    <ChevronRight size={20} />
                </Button>
            </motion.div>
        </motion.div>
    );
});

SpeedometerScore.displayName = 'SpeedometerScore';

SpeedometerScore.propTypes = {
    score: PropTypes.number.isRequired,
    category: PropTypes.shape({
        label: PropTypes.string,
        color: PropTypes.string,
        key: PropTypes.string,
    }).isRequired,
    onViewTimeline: PropTypes.func.isRequired,
};

export default SpeedometerScore;
