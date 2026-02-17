import { memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { Shield, AlertCircle } from 'lucide-react';
import Button from '../../../components/ui/Button';

/**
 * Decision buttons with countdown timer display.
 */
const DecisionButtons = memo(function DecisionButtons({
    onDecision,
    timeLeft,
    timerProgress,
    disabled = false,
}) {
    const timerColor = useMemo(() => {
        if (timeLeft <= 2) return '#EF4444';
        if (timeLeft <= 3) return '#F59E0B';
        return '#3B82F6';
    }, [timeLeft]);

    const isUrgent = timeLeft <= 2;

    return (
        <div className="w-full space-y-4">
            {/* Timer */}
            <div className="flex flex-col items-center gap-2">
                <motion.div
                    className={`relative flex items-center justify-center w-14 h-14 rounded-full border-2 ${isUrgent ? 'animate-shake' : ''}`}
                    style={{ borderColor: timerColor }}
                    animate={isUrgent ? { scale: [1, 1.05, 1] } : {}}
                    transition={{ duration: 0.3, repeat: isUrgent ? Infinity : 0 }}
                >
                    <span
                        className="text-[1.5rem] font-bold"
                        style={{ color: timerColor }}
                    >
                        {timeLeft}
                    </span>

                    {/* Progress ring (SVG) */}
                    <svg
                        className="absolute inset-0 w-full h-full -rotate-90"
                        viewBox="0 0 56 56"
                    >
                        <circle
                            cx="28"
                            cy="28"
                            r="26"
                            fill="none"
                            stroke={timerColor}
                            strokeWidth="2"
                            strokeDasharray={`${2 * Math.PI * 26}`}
                            strokeDashoffset={`${2 * Math.PI * 26 * (1 - timerProgress / 100)}`}
                            strokeLinecap="round"
                            opacity="0.3"
                            className="transition-all duration-1000 ease-linear"
                        />
                    </svg>
                </motion.div>

                <span className="text-[0.75rem] text-race-muted">
                    {isUrgent ? 'Decide now!' : 'Make your choice'}
                </span>
            </div>

            {/* Buttons */}
            <div className="grid grid-cols-2 gap-3">
                <Button
                    variant="protected"
                    size="lg"
                    onClick={() => onDecision('protected')}
                    disabled={disabled}
                    id="btn-protected"
                    className="flex-col gap-1"
                >
                    <Shield size={20} />
                    <span>I&apos;m Protected</span>
                </Button>

                <Button
                    variant="exposed"
                    size="lg"
                    onClick={() => onDecision('exposed')}
                    disabled={disabled}
                    id="btn-exposed"
                    className="flex-col gap-1"
                >
                    <AlertCircle size={20} />
                    <span>I&apos;m Exposed</span>
                </Button>
            </div>

            <p className="text-center text-[0.6875rem] text-race-muted/60">
                No answer defaults to &quot;Exposed&quot;
            </p>
        </div>
    );
});

DecisionButtons.displayName = 'DecisionButtons';

DecisionButtons.propTypes = {
    onDecision: PropTypes.func.isRequired,
    timeLeft: PropTypes.number.isRequired,
    timerProgress: PropTypes.number.isRequired,
    disabled: PropTypes.bool,
};

export default DecisionButtons;
