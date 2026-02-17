import { memo } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import Card from '../../../components/ui/Card';
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
 * Event card displaying the current risk event.
 */
const EventCard = memo(function EventCard({ event, stageLabel, stageEmoji }) {
    if (!event) return null;

    const severityLabel = getSeverityLabel(event.severity);

    return (
        <motion.div
            key={event.id}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-full"
        >
            <Card padding="lg" className="space-y-4">
                {/* Stage badge */}
                <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-race-surface text-[0.75rem] font-medium text-slate-300">
                        {stageEmoji} {stageLabel}
                    </span>
                    <span className={`severity-badge severity-${event.severity}`}>
                        <AlertTriangle size={12} className="mr-1" />
                        {severityLabel}
                    </span>
                </div>

                {/* Event title */}
                <h3 className="race-subheading text-[1.25rem] text-white leading-tight">
                    {event.title}
                </h3>

                {/* Description */}
                <p className="text-[0.875rem] text-race-muted leading-relaxed">
                    {event.description}
                </p>
            </Card>
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
