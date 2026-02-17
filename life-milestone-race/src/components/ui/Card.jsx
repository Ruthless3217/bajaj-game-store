import { memo } from 'react';
import PropTypes from 'prop-types';

/**
 * Reusable Card component with glass morphism styling.
 */
const Card = memo(function Card({ children, className = '', padding = 'md', glow = false, ...props }) {
    const paddingClasses = {
        none: '',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
    };

    return (
        <div
            className={`race-glass-card ${paddingClasses[padding] || paddingClasses.md} ${glow ? 'glow-blue' : ''} ${className}`}
            {...props}
        >
            {children}
        </div>
    );
});

Card.displayName = 'Card';

Card.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    padding: PropTypes.oneOf(['none', 'sm', 'md', 'lg']),
    glow: PropTypes.bool,
};

export default Card;
