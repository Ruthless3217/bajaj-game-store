/**
 * Severity impact mapping.
 * Returns the score delta for protected/exposed decisions by severity level.
 */

const SEVERITY_MAP = {
    high: { protected: 15, exposed: -20 },
    medium: { protected: 10, exposed: -12 },
    moderate: { protected: 5, exposed: -8 },
};

/**
 * Get impact value for a given severity and decision.
 * @param {'high' | 'medium' | 'moderate'} severity
 * @param {'protected' | 'exposed'} decision
 * @returns {number}
 */
export function getImpact(severity, decision) {
    const map = SEVERITY_MAP[severity];
    if (!map) return 0;
    return map[decision] ?? 0;
}

/**
 * Check if an event is high severity.
 * @param {string} severity
 * @returns {boolean}
 */
export function isHighSeverity(severity) {
    return severity === 'high';
}

/**
 * Get severity display label.
 * @param {string} severity
 * @returns {string}
 */
export function getSeverityLabel(severity) {
    const labels = {
        high: 'Critical',
        medium: 'Significant',
        moderate: 'Moderate',
    };
    return labels[severity] ?? 'Unknown';
}

export default SEVERITY_MAP;
