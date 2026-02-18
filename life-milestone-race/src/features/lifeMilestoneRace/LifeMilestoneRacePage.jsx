import { memo, useCallback, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import { GAME_PHASES, LIFE_STAGES } from './constants/lifeStages';
import { useRaceEngine } from './hooks/useRaceEngine';
import { useTimer } from './hooks/useTimer';
import RaceLayout from '../../components/layout/RaceLayout';
import IntroScreen from './components/IntroScreen';
import StageSelection from './components/StageSelection';
import EventCard from './components/EventCard';
import ProtectionMeter from './components/ProtectionMeter';
import DecisionButtons from './components/DecisionButtons';
import SpeedometerScore from './components/SpeedometerScore';
import TimelineSummary from './components/TimelineSummary';
import ConversionScreen from './components/ConversionScreen';
import LeadForm from './components/LeadForm';
import ThankYou from './components/ThankYou';

const EVENT_TIMER_SECONDS = 5;

/**
 * Feedback overlay shown between events.
 */
const FeedbackOverlay = memo(function FeedbackOverlay({ feedback, onContinue }) {
    if (!feedback) return null;

    const isProtected = feedback.decision === 'protected';

    return (
        <div className="w-full flex flex-col items-center gap-4 animate-fade-in">
            <div
                className={`w-16 h-16 rounded-full flex items-center justify-center text-[2rem] ${isProtected ? 'bg-green-500/20 glow-green' : 'bg-red-500/20 glow-red'
                    }`}
            >
                {isProtected ? '🛡️' : '⚠️'}
            </div>

            <div className="text-center space-y-1">
                <p className="text-[1.125rem] font-bold text-white">
                    {isProtected ? 'You\'re Protected!' : 'You\'re Exposed!'}
                </p>
                <p className="text-race-muted text-[0.8125rem]">
                    {feedback.title}
                </p>
                <p
                    className={`text-[1.25rem] font-extrabold ${feedback.delta >= 0 ? 'text-green-400' : 'text-red-400'
                        }`}
                >
                    {feedback.delta > 0 ? '+' : ''}
                    {feedback.delta} points
                </p>
            </div>

            <button
                onClick={onContinue}
                className="race-button-primary text-[0.875rem] px-6 py-2.5 mt-2"
                id="btn-continue-race"
            >
                Continue Race →
            </button>
        </div>
    );
});

/**
 * Compact game status bar with thick orange progress bar.
 */
const RaceProgress = memo(function RaceProgress({ current, total, progress }) {
    return (
        <div className="w-full space-y-2">
            <div className="flex justify-between items-center">
                <span className="text-[0.875rem] font-bold text-white">
                    Event {current}/{total}
                </span>
                <span className="text-[0.875rem] font-bold text-white">
                    {progress}%
                </span>
            </div>
            <div
                className="w-full rounded-full overflow-hidden"
                style={{ height: '14px', backgroundColor: 'rgba(255,255,255,0.08)' }}
            >
                <div
                    className="h-full rounded-full transition-all duration-500 ease-out"
                    style={{
                        width: `${progress}%`,
                        background: 'linear-gradient(90deg, #FF8C00 0%, #FF6600 100%)',
                        boxShadow: '0 0 12px rgba(255, 140, 0, 0.4)',
                    }}
                />
            </div>
        </div>
    );
});

/**
 * Main page for the Life Milestone Race feature.
 * Orchestrates the game flow by rendering phase-appropriate components.
 * Business logic lives in useRaceEngine; this component is purely presentational.
 */
const LifeMilestoneRacePage = memo(function LifeMilestoneRacePage() {
    const engine = useRaceEngine();

    const {
        gameId,
        phase,
        score,
        currentEvent,
        currentEventIndex,
        eventQueue,
        timeline,
        lastFeedback,
        isTimerActive,
        protectionCategory,
        finalScore,
        riskGaps,
        progressPercent,
        userName,
        startGame,
        selectStage,
        makeDecision,
        handleTimerExpire,
        advanceToNextEvent,
        showScoreReveal,
        showTimeline,
        showConversion,
        showLeadForm,
        showThankYou,
        restartGame,
    } = engine;

    const { timeLeft, progress: timerProgress } = useTimer(
        EVENT_TIMER_SECONDS,
        handleTimerExpire,
        isTimerActive,
    );

    // Resolve current event stage metadata
    const currentStage = useMemo(() => {
        if (!currentEvent) return null;
        return LIFE_STAGES.find((s) => s.id === currentEvent.stage) ?? null;
    }, [currentEvent]);

    const handleLeadSuccess = useCallback((formData) => {
        showThankYou(formData?.name);
    }, [showThankYou]);

    const renderPhase = () => {
        switch (phase) {
            case GAME_PHASES.INTRO:
                return <IntroScreen key="intro" onStart={startGame} />;

            case GAME_PHASES.STAGE_SELECTION:
                return <StageSelection key="stage-select" onSelectStage={selectStage} />;

            case GAME_PHASES.RACING:
                return (
                    <div key="racing" className="w-full flex flex-col gap-6 animate-fade-in" style={{ padding: '0.5rem 0' }}>
                        <RaceProgress
                            current={currentEventIndex + 1}
                            total={eventQueue.length}
                            progress={progressPercent}
                        />
                        <ProtectionMeter score={score} />
                        <EventCard
                            event={currentEvent}
                            stageLabel={currentStage?.label}
                            stageEmoji={currentStage?.emoji}
                        />
                        <DecisionButtons
                            onDecision={makeDecision}
                            timeLeft={timeLeft}
                            timerProgress={timerProgress}
                        />
                    </div>
                );

            case GAME_PHASES.EVENT_FEEDBACK:
                return (
                    <FeedbackOverlay
                        key="feedback"
                        feedback={lastFeedback}
                        onContinue={advanceToNextEvent}
                    />
                );

            case GAME_PHASES.FINISH:
                return (
                    <div key="finish" className="w-full flex flex-col items-center gap-6 animate-fade-in">
                        <div className="text-center space-y-2">
                            <div className="text-[3rem]">🏁</div>
                            <h2 className="race-heading text-[1.75rem] text-white">
                                Finish Line!
                            </h2>
                            <p className="text-race-muted text-[0.875rem]">
                                You&apos;ve completed the Life Milestone Race
                            </p>
                        </div>
                        <button
                            onClick={showScoreReveal}
                            className="race-button-primary text-[1rem] px-8 py-3"
                            id="btn-reveal-score"
                        >
                            Reveal My Score 🏆
                        </button>
                    </div>
                );

            case GAME_PHASES.SCORE_REVEAL:
                return (
                    <SpeedometerScore
                        key="score"
                        score={finalScore}
                        category={protectionCategory}
                        onViewTimeline={showTimeline}
                    />
                );

            case GAME_PHASES.TIMELINE:
                return (
                    <TimelineSummary
                        key="timeline"
                        timeline={timeline}
                        onContinue={showConversion}
                    />
                );

            case GAME_PHASES.CONVERSION:
                return (
                    <ConversionScreen
                        key="conversion"
                        score={finalScore}
                        category={protectionCategory}
                        onBookSlot={showLeadForm}
                    />
                );

            case GAME_PHASES.LEAD_FORM:
                return (
                    <LeadForm
                        key="lead-form"
                        gameId={gameId}
                        score={finalScore}
                        category={protectionCategory}
                        riskGaps={riskGaps}
                        onSuccess={handleLeadSuccess}
                    />
                );

            case GAME_PHASES.THANK_YOU:
                return (
                    <ThankYou
                        key="thank-you"
                        name={userName}
                    />
                );

            default:
                return null;
        }
    };

    return (
        <RaceLayout>
            <AnimatePresence mode="wait">
                {renderPhase()}
            </AnimatePresence>
        </RaceLayout>
    );
});

LifeMilestoneRacePage.displayName = 'LifeMilestoneRacePage';

export default LifeMilestoneRacePage;
