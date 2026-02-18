/**
 * Life stages used throughout the race simulation.
 * Each stage represents a significant life milestone.
 */

export const LIFE_STAGES = [
    {
        id: 'first-job',
        label: 'First Job',
        emoji: '💼',
        description: 'Starting your career journey',
        order: 1,
        color: '#3B82F6',
    },
    {
        id: 'marriage',
        label: 'Marriage',
        emoji: '💍',
        description: 'Building a life together',
        order: 2,
        color: '#EC4899',
    },
    {
        id: 'parenthood',
        label: 'Parenthood',
        emoji: '👶',
        description: 'Welcoming a new life',
        order: 3,
        color: '#F59E0B',
    },
    {
        id: 'mid-career',
        label: 'Mid-Career',
        emoji: '📈',
        description: 'Peak responsibilities',
        order: 4,
        color: '#10B981',
    },
    {
        id: 'retirement',
        label: 'Retirement',
        emoji: '🏖️',
        description: 'Securing your golden years',
        order: 5,
        color: '#8B5CF6',
    },
];

/**
 * Score category thresholds for protection assessment.
 */
export const SCORE_CATEGORIES = {
    LOW: { min: 0, max: 35, label: 'Low Protection', color: '#EF4444' },
    MEDIUM: { min: 36, max: 70, label: 'Medium Protection', color: '#F59E0B' },
    HIGH: { min: 71, max: 100, label: 'High Protection', color: '#10B981' },
};

/**
 * Initial score baseline for all new games.
 */
export const INITIAL_SCORE = 50;

/**
 * Timer duration per event (in seconds).
 */
export const EVENT_TIMER_SECONDS = 5;

/**
 * Decision types.
 */
export const DECISIONS = {
    PROTECTED: 'protected',
    EXPOSED: 'exposed',
};

/**
 * Game phases for state machine.
 */
export const GAME_PHASES = {
    INTRO: 'intro',
    STAGE_SELECTION: 'stage_selection',
    RACING: 'racing',
    EVENT_FEEDBACK: 'event_feedback',
    FINISH: 'finish',
    SCORE_REVEAL: 'score_reveal',
    TIMELINE: 'timeline',
    CONVERSION: 'conversion',
    LEAD_FORM: 'lead_form',
    THANK_YOU: 'thank_you',
};
