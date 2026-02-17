import { memo } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { Zap, Shield, ChevronRight } from 'lucide-react';
import Button from '../../../components/ui/Button';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

/**
 * Intro screen with game title, concept explanation, and CTA.
 */
const IntroScreen = memo(function IntroScreen({ onStart }) {
    return (
        <motion.div
            className="w-full flex flex-col items-center text-center gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* Icon */}
            <motion.div
                variants={itemVariants}
                className="relative"
            >
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-bajaj-blue to-race-accent flex items-center justify-center glow-blue">
                    <Zap size={40} className="text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-bajaj-orange rounded-full flex items-center justify-center animate-pulse">
                    <span className="text-[0.625rem] font-bold text-white">!</span>
                </div>
            </motion.div>

            {/* Title */}
            <motion.div variants={itemVariants} className="space-y-3">
                <h1 className="race-heading text-[2rem] md:text-[2.5rem] text-white">
                    Life Milestone
                    <span className="block text-gradient-orange">Race</span>
                </h1>
                <p className="text-race-muted text-[0.9375rem] max-w-xs mx-auto leading-relaxed">
                    Navigate life&apos;s biggest moments. Face unexpected risks. Discover how protected you really are.
                </p>
            </motion.div>

            {/* Feature pills */}
            <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-3">
                {[
                    { icon: <Zap size={14} />, text: 'Fast-Paced' },
                    { icon: <Shield size={14} />, text: '5-Second Decisions' },
                ].map((pill) => (
                    <span
                        key={pill.text}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-race-surface border border-race-border text-[0.8125rem] text-slate-300"
                    >
                        {pill.icon} {pill.text}
                    </span>
                ))}
            </motion.div>

            {/* CTA */}
            <motion.div variants={itemVariants} className="w-full max-w-xs">
                <Button
                    variant="primary"
                    size="lg"
                    className="w-full"
                    onClick={onStart}
                    id="btn-start-race"
                >
                    Start the Race
                    <ChevronRight size={20} />
                </Button>
            </motion.div>

            {/* Disclaimer */}
            <motion.p
                variants={itemVariants}
                className="text-[0.75rem] text-race-muted/60 max-w-xs"
            >
                This is a financial awareness simulation — not a financial advisory tool.
            </motion.p>
        </motion.div>
    );
});

IntroScreen.displayName = 'IntroScreen';

IntroScreen.propTypes = {
    onStart: PropTypes.func.isRequired,
};

export default IntroScreen;
