import { memo, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
};

const contentVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.95, y: 20 },
};

/**
 * Reusable modal overlaying the game screen.
 */
const Modal = memo(function Modal({ isOpen, onClose, title, children, className = '' }) {
    const handleKeyDown = useCallback(
        (e) => {
            if (e.key === 'Escape') onClose?.();
        },
        [onClose],
    );

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [isOpen, handleKeyDown]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    variants={overlayVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    transition={{ duration: 0.2 }}
                >
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={onClose}
                        role="presentation"
                    />

                    {/* Content */}
                    <motion.div
                        className={`relative z-10 w-full max-w-lg race-glass-card p-6 ${className}`}
                        variants={contentVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        role="dialog"
                        aria-modal="true"
                        aria-label={title}
                    >
                        {/* Header */}
                        {(title || onClose) && (
                            <div className="flex items-center justify-between mb-4">
                                {title && (
                                    <h2 className="text-[1.25rem] font-bold text-white">{title}</h2>
                                )}
                                {onClose && (
                                    <button
                                        onClick={onClose}
                                        className="p-1.5 rounded-lg text-race-muted hover:text-white hover:bg-race-surface transition-colors"
                                        aria-label="Close modal"
                                    >
                                        <X size={20} />
                                    </button>
                                )}
                            </div>
                        )}

                        {children}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
});

Modal.displayName = 'Modal';

Modal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func,
    title: PropTypes.string,
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
};

export default Modal;
