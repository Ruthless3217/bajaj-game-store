import { memo } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import { getSeverityLabel } from '../utils/severityImpact';

const cardVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
    },
    exit: {
        opacity: 0,
        y: -30,
        scale: 0.95,
        transition: { duration: 0.3, ease: 'easeIn' },
    },
};

/**
 * Hero-style event card — dramatic, game challenge feel.
 * Slightly lighter blue bg, 24px corners, soft shadow, big text.
 */
const EventCard = memo(function EventCard({ event, stageLabel, stageEmoji }) {
    if (!event) return null;

    const severityLabel = getSeverityLabel(event.severity);

    // Severity color mapping for the pill
    const severityStyle = {
        high: {
            bg: '#FF8C00',
            text: '#fff',
            glow: 'rgba(255, 140, 0, 0.4)',
        },
        medium: {
            bg: 'rgba(245, 158, 11, 0.2)',
            text: '#F59E0B',
            glow: 'none',
        },
        moderate: {
            bg: 'rgba(59, 130, 246, 0.2)',
            text: '#60A5FA',
            glow: 'none',
        },
    }[event.severity] || { bg: 'rgba(255,255,255,0.1)', text: '#fff', glow: 'none' };

    return (
        <motion.div
            key={event.id}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-full"
        >
            <div
                className="w-full text-center space-y-5"
                style={{
                    background: 'linear-gradient(180deg, rgba(30, 42, 69, 0.95) 0%, rgba(19, 27, 46, 0.9) 100%)',
                    borderRadius: '24px',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    padding: '2rem 1.5rem',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), 0 2px 8px rgba(0, 0, 0, 0.2)',
                }}
            >
                {/* Severity tag — orange pill with icon for critical */}
                <div className="flex justify-center">
                    <span
                        className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[0.8125rem] font-black uppercase tracking-wider"
                        style={{
                            backgroundColor: severityStyle.bg,
                            color: severityStyle.text,
                            boxShadow: severityStyle.glow !== 'none' ? `0 0 12px ${severityStyle.glow}` : undefined,
                        }}
                    >
                        <AlertTriangle size={14} />
                        {severityLabel}
                    </span>
                </div>

                {/* Event title — large, bold, centered */}
                <h3
                    className="font-black text-white leading-tight"
                    style={{ fontSize: '1.5rem', letterSpacing: '-0.02em' }}
                >
                    {event.title}
                </h3>

                {/* Description — 18px minimum */}
                <p
                    className="text-white/70 leading-relaxed max-w-xs mx-auto"
                    style={{ fontSize: '1.0625rem' }}
                >
                    {event.description}
                </p>
            </div>
        </motion.div>
    );
});

EventCard.displayName = 'EventCard';

EventCard.propTypes = {
    event: PropTypes.shape({
        id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        severity: PropTypes.oneOf(['high', 'medium', 'moderate']).isRequired,
        stage: PropTypes.string.isRequired,
    }),
    stageLabel: PropTypes.string,
    stageEmoji: PropTypes.string,
};

export default EventCard;
