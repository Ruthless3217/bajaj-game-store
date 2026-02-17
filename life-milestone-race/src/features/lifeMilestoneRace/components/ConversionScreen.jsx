import { memo } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { Share2, Phone, CalendarClock } from 'lucide-react';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.12, delayChildren: 0.1 },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

/**
 * Conversion screen with Share, Call, and Book Slot CTAs.
 */
const ConversionScreen = memo(function ConversionScreen({
    score,
    category,
    onBookSlot,
}) {
    const handleShare = () => {
        const shareText = `I scored ${score}/100 (${category?.label}) on the Life Milestone Race! How protected are you? 🏁`;

        if (navigator.share) {
            navigator.share({
                title: 'Life Milestone Race',
                text: shareText,
                url: window.location.href,
            }).catch(() => {
                // User cancelled or share failed — no-op
            });
        } else {
            navigator.clipboard?.writeText(shareText);
        }
    };

    const handleCall = () => {
        window.location.href = 'tel:+911800209888';
    };

    return (
        <motion.div
            className="w-full flex flex-col items-center gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* Header */}
            <motion.div variants={itemVariants} className="text-center space-y-2">
                <h2 className="race-subheading text-[1.5rem] text-white">
                    Strengthen Your Protection
                </h2>
                <p className="text-race-muted text-[0.875rem] max-w-xs mx-auto">
                    Your score: <span className="font-bold text-white">{score}/100</span>{' '}
                    <span style={{ color: category?.color }}>({category?.label})</span>
                </p>
            </motion.div>

            {/* Supportive message */}
            <motion.div variants={itemVariants}>
                <Card padding="md" className="text-center">
                    <p className="text-[0.9375rem] text-slate-300 leading-relaxed">
                        &ldquo;Life moves faster than planning.<br />
                        Let&apos;s strengthen your protection together.&rdquo;
                    </p>
                </Card>
            </motion.div>

            {/* CTA cards */}
            <div className="w-full space-y-3">
                <motion.div variants={itemVariants}>
                    <button
                        onClick={handleShare}
                        className="w-full race-glass-card p-4 flex items-center gap-4 transition-all duration-300 hover:border-race-accent/50 cursor-pointer"
                        id="btn-share"
                    >
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                            <Share2 size={20} className="text-white" />
                        </div>
                        <div className="text-left flex-1">
                            <p className="font-semibold text-white text-[0.9375rem]">
                                Share Your Score
                            </p>
                            <p className="text-[0.75rem] text-race-muted">
                                Challenge friends & family
                            </p>
                        </div>
                    </button>
                </motion.div>

                <motion.div variants={itemVariants}>
                    <button
                        onClick={handleCall}
                        className="w-full race-glass-card p-4 flex items-center gap-4 transition-all duration-300 hover:border-race-accent/50 cursor-pointer"
                        id="btn-call"
                    >
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center flex-shrink-0">
                            <Phone size={20} className="text-white" />
                        </div>
                        <div className="text-left flex-1">
                            <p className="font-semibold text-white text-[0.9375rem]">
                                Call Now
                            </p>
                            <p className="text-[0.75rem] text-race-muted">
                                Speak to an expert immediately
                            </p>
                        </div>
                    </button>
                </motion.div>

                <motion.div variants={itemVariants}>
                    <Button
                        variant="primary"
                        size="lg"
                        className="w-full"
                        onClick={onBookSlot}
                        id="btn-book-slot"
                    >
                        <CalendarClock size={20} />
                        Book a Convenient Slot
                    </Button>
                </motion.div>
            </div>
        </motion.div>
    );
});

ConversionScreen.displayName = 'ConversionScreen';

ConversionScreen.propTypes = {
    score: PropTypes.number.isRequired,
    category: PropTypes.shape({
        label: PropTypes.string,
        color: PropTypes.string,
    }),
    onBookSlot: PropTypes.func.isRequired,
};

export default ConversionScreen;
