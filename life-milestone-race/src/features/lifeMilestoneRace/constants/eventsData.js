/**
 * Events data for the Life Milestone Race.
 * Events are categorized by life stage and severity.
 *
 * Severity impact rules:
 *   HIGH:     +15 protected / -20 exposed
 *   MEDIUM:   +10 protected / -12 exposed
 *   MODERATE: +5  protected / -8  exposed
 */

const EVENTS = [
    // ───────────────────────── First Job ─────────────────────────
    {
        id: 'fj-01',
        stage: 'first-job',
        title: 'Sudden Medical Emergency',
        severity: 'high',
        description: 'A critical health issue requires immediate hospitalisation. Medical bills are piling up fast.',
        impactProtected: 15,
        impactExposed: -20,
    },
    {
        id: 'fj-02',
        stage: 'first-job',
        title: 'Bike Accident Injury',
        severity: 'medium',
        description: 'A road accident leaves you with injuries needing weeks of recovery and treatment costs.',
        impactProtected: 10,
        impactExposed: -12,
    },
    {
        id: 'fj-03',
        stage: 'first-job',
        title: 'Laptop Theft',
        severity: 'moderate',
        description: 'Your work laptop and valuables are stolen from your paying guest accommodation.',
        impactProtected: 5,
        impactExposed: -8,
    },

    // ───────────────────────── Marriage ─────────────────────────
    {
        id: 'mr-01',
        stage: 'marriage',
        title: 'Spouse Critical Illness',
        severity: 'high',
        description: 'Your spouse is diagnosed with a critical illness requiring expensive long-term treatment.',
        impactProtected: 15,
        impactExposed: -20,
    },
    {
        id: 'mr-02',
        stage: 'marriage',
        title: 'Home Loan EMI Default Risk',
        severity: 'medium',
        description: 'An unexpected job change puts your home loan EMI payments at risk for several months.',
        impactProtected: 10,
        impactExposed: -12,
    },
    {
        id: 'mr-03',
        stage: 'marriage',
        title: 'Wedding Expense Overrun',
        severity: 'moderate',
        description: 'Wedding expenses significantly exceeded the budget, eating into your emergency fund.',
        impactProtected: 5,
        impactExposed: -8,
    },

    // ───────────────────────── Parenthood ─────────────────────────
    {
        id: 'ph-01',
        stage: 'parenthood',
        title: 'Child Born with Health Complications',
        severity: 'high',
        description: 'Your newborn requires NICU care and specialised treatment for several weeks.',
        impactProtected: 15,
        impactExposed: -20,
    },
    {
        id: 'ph-02',
        stage: 'parenthood',
        title: 'Daycare & Education Cost Spike',
        severity: 'medium',
        description: 'Premium childcare and education costs have doubled, straining your monthly budget.',
        impactProtected: 10,
        impactExposed: -12,
    },
    {
        id: 'ph-03',
        stage: 'parenthood',
        title: 'Parental Emergency Travel',
        severity: 'moderate',
        description: 'An elderly parent falls ill in another city, requiring urgent travel and medical support.',
        impactProtected: 5,
        impactExposed: -8,
    },

    // ───────────────────────── Mid-Career ─────────────────────────
    {
        id: 'mc-01',
        stage: 'mid-career',
        title: 'Disability from Workplace Injury',
        severity: 'high',
        description: 'A serious workplace accident causes partial disability, impacting your ability to earn.',
        impactProtected: 15,
        impactExposed: -20,
    },
    {
        id: 'mc-02',
        stage: 'mid-career',
        title: 'Business Venture Failure',
        severity: 'medium',
        description: 'A side business investment crashes, wiping out a significant portion of your savings.',
        impactProtected: 10,
        impactExposed: -12,
    },
    {
        id: 'mc-03',
        stage: 'mid-career',
        title: "Child's Higher Education Abroad",
        severity: 'moderate',
        description: 'Your child gets admission overseas. The tuition and living costs are substantial.',
        impactProtected: 5,
        impactExposed: -8,
    },

    // ───────────────────────── Retirement ─────────────────────────
    {
        id: 'rt-01',
        stage: 'retirement',
        title: 'Longevity Risk — Outliving Savings',
        severity: 'high',
        description: 'Medical advances mean you may live 15+ years post-retirement. Will your corpus last?',
        impactProtected: 15,
        impactExposed: -20,
    },
    {
        id: 'rt-02',
        stage: 'retirement',
        title: 'Inflation Eroding Pension',
        severity: 'medium',
        description: 'Rising inflation has significantly reduced the purchasing power of your pension income.',
        impactProtected: 10,
        impactExposed: -12,
    },
    {
        id: 'rt-03',
        stage: 'retirement',
        title: 'Elderly Care Dependency',
        severity: 'moderate',
        description: 'Aging parents or your own need for full-time care creates recurring monthly expenses.',
        impactProtected: 5,
        impactExposed: -8,
    },
];

export default EVENTS;
