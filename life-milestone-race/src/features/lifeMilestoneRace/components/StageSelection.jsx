import { memo, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { MapPin, ChevronRight } from 'lucide-react';
import { LIFE_STAGES } from '../constants/lifeStages';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.08, delayChildren: 0.1 },
    },
};

const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

/**
 * Stage selection screen.
 * Player picks their current life stage to begin the race from.
 */
const StageSelection = memo(function StageSelection({ onSelectStage }) {
    const [selected, setSelected] = useState(null);

    const handleSelect = useCallback((stageId) => {
        setSelected(stageId);
    }, []);

    const handleConfirm = useCallback(() => {
        if (selected) onSelectStage(selected);
    }, [selected, onSelectStage]);

    return (
        <motion.div
            className="w-full flex flex-col items-center gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* Header */}
            <motion.div variants={itemVariants} className="text-center space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-race-surface border border-race-border text-[0.75rem] text-race-accent font-medium">
                    <MapPin size={12} /> Choose Your Starting Point
                </div>
                <h2 className="race-subheading text-[1.5rem] text-white">
                    Where are you in life?
                </h2>
                <p className="text-race-muted text-[0.875rem]">
                    Select your current life stage to start the simulation
                </p>
            </motion.div>

            {/* Stage List */}
            <div className="w-full space-y-3">
                {LIFE_STAGES.map((stage) => {
                    const isSelected = selected === stage.id;
                    return (
                        <motion.div key={stage.id} variants={itemVariants}>
                            <Card
                                padding="none"
                                className={`cursor-pointer transition-all duration-300 ${isSelected
                                        ? 'border-race-accent glow-blue'
                                        : 'hover:border-race-accent/50'
                                    }`}
                                onClick={() => handleSelect(stage.id)}
                                role="radio"
                                aria-checked={isSelected}
                                tabIndex={0}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        handleSelect(stage.id);
                                    }
                                }}
                            >
                                <div className="flex items-center gap-4 p-4">
                                    {/* Radio indicator */}
                                    <div
                                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200 ${isSelected
                                                ? 'border-race-accent bg-race-accent'
                                                : 'border-race-muted'
                                            }`}
                                    >
                                        {isSelected && (
                                            <div className="w-2 h-2 rounded-full bg-white" />
                                        )}
                                    </div>

                                    {/* Stage info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[1.25rem]">{stage.emoji}</span>
                                            <span className="font-semibold text-white text-[1rem]">
                                                {stage.label}
                                            </span>
                                        </div>
                                        <p className="text-[0.8125rem] text-race-muted mt-0.5">
                                            {stage.description}
                                        </p>
                                    </div>

                                    {/* Order badge */}
                                    <span
                                        className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-[0.75rem] font-bold"
                                        style={{ backgroundColor: `${stage.color}20`, color: stage.color }}
                                    >
                                        {stage.order}
                                    </span>
                                </div>
                            </Card>
                        </motion.div>
                    );
                })}
            </div>

            {/* Confirm */}
            <motion.div variants={itemVariants} className="w-full">
                <Button
                    variant="primary"
                    size="lg"
                    className="w-full"
                    disabled={!selected}
                    onClick={handleConfirm}
                    id="btn-confirm-stage"
                >
                    Begin Race
                    <ChevronRight size={20} />
                </Button>
            </motion.div>
        </motion.div>
    );
});

StageSelection.displayName = 'StageSelection';

StageSelection.propTypes = {
    onSelectStage: PropTypes.func.isRequired,
};

export default StageSelection;
