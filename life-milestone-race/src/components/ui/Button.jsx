import { memo, forwardRef } from 'react';
import PropTypes from 'prop-types';

/**
 * Reusable Button component with variant support.
 */
const VARIANT_CLASSES = {
    primary: 'race-button-primary',
    secondary: 'race-button-secondary',
    protected: 'race-button-protected',
    exposed: 'race-button-exposed',
    ghost: 'inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 font-semibold text-race-muted hover:text-white transition-colors duration-300 focus:outline-none',
};

const SIZE_CLASSES = {
    sm: 'text-[0.875rem] px-4 py-2',
    md: 'text-[1rem] px-6 py-3',
    lg: 'text-[1.125rem] px-8 py-4',
};

const Button = memo(
    forwardRef(function Button(
        { variant = 'primary', size = 'md', children, className = '', disabled = false, ...props },
        ref,
    ) {
        const baseClasses = VARIANT_CLASSES[variant] || VARIANT_CLASSES.primary;
        const sizeClasses = SIZE_CLASSES[size] || SIZE_CLASSES.md;

        return (
            <button
                ref={ref}
                className={`${baseClasses} ${sizeClasses} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={disabled}
                {...props}
            >
                {children}
            </button>
        );
    }),
);

Button.displayName = 'Button';

Button.propTypes = {
    variant: PropTypes.oneOf(['primary', 'secondary', 'protected', 'exposed', 'ghost']),
    size: PropTypes.oneOf(['sm', 'md', 'lg']),
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    disabled: PropTypes.bool,
};

export default Button;
