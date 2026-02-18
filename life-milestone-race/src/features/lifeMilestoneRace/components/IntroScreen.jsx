import { memo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, X, Check, Loader2 } from 'lucide-react';
import Button from '../../../components/ui/Button';
import bgImage from '../../../assets/image/Life-Milestone-Race.png';
import { submitToLMS } from '../../../utils/api';

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
 * Intro screen with game title image and CTA.
 * Now includes Name Input Popup for lead generation.
 */
const IntroScreen = memo(function IntroScreen({ onStart }) {
    // Local State
    const [showNamePopup, setShowNamePopup] = useState(false);
    const [userName, setUserName] = useState('');
    const [phone, setPhone] = useState('');
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [showTerms, setShowTerms] = useState(false);

    // Validation & Loading State
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [lastSubmittedPhone, setLastSubmittedPhone] = useState(() => {
        return sessionStorage.getItem('lastSubmittedPhone') || null;
    });

    // Toast State
    const [toast, setToast] = useState(null);

    useEffect(() => {
        if (lastSubmittedPhone) {
            sessionStorage.setItem('lastSubmittedPhone', lastSubmittedPhone);
        }
    }, [lastSubmittedPhone]);

    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => setToast(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [toast]);

    const showToastMessage = (message, type = 'error') => {
        setToast({ message, type });
    };

    const handleStartClick = () => {
        setShowNamePopup(true);
    };

    const validateForm = () => {
        const newErrors = {};

        // Name Validation
        if (!userName.trim()) {
            newErrors.name = 'Please enter your name';
        } else if (!/^[A-Za-z\s]+$/.test(userName.trim())) {
            newErrors.name = 'Name must contain only letters';
        }

        // Phone Validation (Indian: 10 digits, starts with 6-9 usually)
        if (!phone) {
            newErrors.phone = 'Please enter mobile number';
        } else if (!/^[6-9]\d{9}$/.test(phone)) {
            newErrors.phone = 'Enter valid 10-digit mobile number';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNameSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;
        if (!termsAccepted) return;

        // Duplicate Check
        if (lastSubmittedPhone === phone) {
            showToastMessage("You have already registered.", "info");
            setTimeout(() => {
                onStart(userName.trim());
            }, 1000);
            return;
        }

        setIsSubmitting(true);

        try {
            // Calculate Preferred Date (Tomorrow) & Time (09:00 AM)
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            const dateStr = tomorrow.toISOString().split('T')[0]; // YYYY-MM-DD

            const payload = {
                name: userName.trim(),
                mobile_no: phone,
                param4: dateStr,      // Preferred Date
                param19: "09:00 AM",   // Preferred Time
                summary_dtls: "Game Lead Generator",
                p_data_source: "LIFE_MILESTONE_RACE_LEAD"
            };

            const result = await submitToLMS(payload);

            if (result.success) {
                setLastSubmittedPhone(phone);
                onStart(userName.trim());
            } else {
                showToastMessage("Submission failed. Please try again.");
            }
        } catch (err) {
            console.error(err);
            showToastMessage("Something went wrong.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <motion.div
            className="w-full flex-1 min-h-[100dvh] flex flex-col items-center justify-end pb-6 pt-8 relative overflow-hidden"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            style={{
                backgroundImage: `url(${bgImage})`,
                backgroundSize: '100% 100%',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
            }}

        >
            {/* CTA */}
            <motion.div variants={itemVariants} className="w-full max-w-xs z-10">
                <Button
                    variant="primary"
                    size="lg"
                    className="w-full shadow-lg text-white btn-5"
                    onClick={handleStartClick}
                    id="btn-start-race"
                    style={{
                        background: 'linear-gradient(135deg, #FF6600 0%, #F59E0B 100%)',
                    }}
                >
                    Start the Race
                    <ChevronRight size={20} />
                </Button>
            </motion.div>

            {/* Name Input Popup */}
            <AnimatePresence>
                {showNamePopup && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md"
                        onClick={() => setShowNamePopup(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            onClick={(e) => e.stopPropagation()}
                            className="relative bg-white shadow-2xl w-full max-w-[320px] min-[375px]:max-w-[340px] p-5 min-[375px]:p-6 border-[4px] sm:border-[6px] border-[#0066B2] rounded-2xl"
                        >
                            <button
                                onClick={() => setShowNamePopup(false)}
                                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                <X className="w-5 h-5 min-[375px]:w-6 min-[375px]:h-6" />
                            </button>

                            <div className="text-center mb-4 min-[375px]:mb-6">
                                <div className="w-14 h-14 min-[375px]:w-16 min-[375px]:h-16 sm:w-20 sm:h-20 bg-[#0066B2] flex items-center justify-center mx-auto mb-3 min-[375px]:mb-4 shadow-xl border-4 border-white rounded-full">
                                    <span className="text-2xl min-[375px]:text-3xl sm:text-4xl">👋</span>
                                </div>
                                <h2 className="text-[#0066B2] text-lg min-[375px]:text-xl sm:text-2xl font-black mb-1">Welcome!</h2>
                                <p className="text-slate-500 font-bold text-xs min-[375px]:text-sm sm:text-base">Enter your details to start.</p>
                            </div>

                            <form onSubmit={handleNameSubmit} className="space-y-3 min-[375px]:space-y-4">
                                {/* Name Field */}
                                <div className="space-y-1 min-[375px]:space-y-1.5 text-left">
                                    <label className="block text-slate-700 text-[9px] min-[375px]:text-[10px] sm:text-xs font-black uppercase tracking-widest ml-1" htmlFor="userName">
                                        Your Name
                                    </label>
                                    <input
                                        id="userName"
                                        type="text"
                                        value={userName}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            // Only allow letters and spaces
                                            if (/^[A-Za-z\s]*$/.test(val)) {
                                                setUserName(val);
                                                if (errors.name) setErrors({ ...errors, name: '' });
                                            }
                                        }}
                                        placeholder="Full Name"
                                        className={`w-full px-3 py-2.5 min-[375px]:px-4 min-[375px]:py-3 sm:py-3.5 border-4 ${errors.name ? 'border-red-400 focus:border-red-500 bg-red-50' : 'border-slate-100 focus:border-[#0066B2]'} focus:outline-none focus:ring-4 focus:ring-[#0066B2]/10 text-slate-800 font-bold text-sm min-[375px]:text-base sm:text-lg transition-all rounded-lg`}
                                        autoFocus
                                    />
                                    {errors.name && (
                                        <p className="text-red-500 text-[9px] min-[375px]:text-[10px] font-black uppercase tracking-wider ml-1">{errors.name}</p>
                                    )}
                                </div>

                                {/* Phone Field */}
                                <div className="space-y-1 min-[375px]:space-y-1.5 text-left">
                                    <label className="block text-slate-700 text-[9px] min-[375px]:text-[10px] sm:text-xs font-black uppercase tracking-widest ml-1" htmlFor="phone">
                                        Mobile Number
                                    </label>
                                    <input
                                        id="phone"
                                        type="tel"
                                        maxLength={10}
                                        value={phone}
                                        onChange={(e) => {
                                            const val = e.target.value.replace(/\D/g, '').slice(0, 10);

                                            // Only allow validation if empty or starts with 6-9
                                            if (val === '' || /^[6-9]/.test(val)) {
                                                setPhone(val);
                                                if (errors.phone) setErrors({ ...errors, phone: '' });
                                            }
                                        }}
                                        placeholder="9876543210"
                                        className={`w-full px-3 py-2.5 min-[375px]:px-4 min-[375px]:py-3 sm:py-3.5 border-4 ${errors.phone ? 'border-red-400 focus:border-red-500 bg-red-50' : 'border-slate-100 focus:border-[#0066B2]'} focus:outline-none focus:ring-4 focus:ring-[#0066B2]/10 text-slate-800 font-bold text-sm min-[375px]:text-base sm:text-lg transition-all rounded-lg`}
                                    />
                                    {errors.phone && (
                                        <p className="text-red-500 text-[9px] min-[375px]:text-[10px] font-black uppercase tracking-wider ml-1">{errors.phone}</p>
                                    )}
                                </div>

                                {/* Terms Checkbox */}
                                <div className="flex items-start space-x-3 pt-1 text-left">
                                    <div className="relative flex items-center">
                                        <input
                                            id="terms"
                                            type="checkbox"
                                            checked={termsAccepted}
                                            onChange={(e) => setTermsAccepted(e.target.checked)}
                                            className="peer h-5 w-5 cursor-pointer appearance-none rounded border-2 border-slate-300 bg-slate-50 transition-all checked:border-[#0066B2] checked:bg-[#0066B2] hover:border-[#0066B2]"
                                        />
                                        <Check className="pointer-events-none absolute left-1/2 top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 transition-opacity peer-checked:opacity-100" strokeWidth={4} />
                                    </div>
                                    <label htmlFor="terms" className="text-[10px] sm:text-xs font-semibold text-slate-500 leading-tight select-none">
                                        I agree to the <button type="button" onClick={() => setShowTerms(true)} className="text-[#0066B2] hover:underline font-bold inline">Term & condition</button> and Acknowledge the Privacy Policy.
                                    </label>
                                </div>

                                <button
                                    type="submit"
                                    disabled={!userName.trim() || phone.length !== 10 || !termsAccepted || isSubmitting}
                                    className="w-full py-2.5 min-[375px]:py-3 sm:py-4 rounded-xl font-game text-sm sm:text-lg tracking-widest disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 text-white uppercase font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
                                    style={{
                                        background: 'linear-gradient(135deg, #0066B2 0%, #3B82F6 100%)',
                                        boxShadow: '0 4px 15px rgba(0, 102, 178, 0.3)'
                                    }}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            <span>Starting...</span>
                                        </>
                                    ) : (
                                        "Let's Go!"
                                    )}
                                </button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Terms Popup Overlay */}
            <AnimatePresence>
                {showTerms && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-md"
                        onClick={() => setShowTerms(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white p-6 rounded-2xl max-w-md w-full shadow-2xl border-4 border-[#0066B2] relative text-left"
                        >
                            <button
                                onClick={() => setShowTerms(false)}
                                className="absolute top-3 right-3 p-1 text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                            <h3 className="text-[#0066B2] font-black text-lg uppercase mb-4 tracking-tight">Terms & Conditions</h3>
                            <div className="text-xs sm:text-sm text-slate-600 space-y-3 font-medium leading-relaxed max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                                <p>
                                    I hereby authorize Bajaj Life Insurance Limited to call me on the contact number made available by me on the website with a specific request to call back. I further declare that, irrespective of my contact number being registered on National Customer Preference Register (NCPR) or on National Do Not Call Registry (NDNC), any call made, SMS or WhatsApp sent in response to my request shall not be construed as an Unsolicited Commercial Communication even though the content of the call may be for the purposes of explaining various insurance products and services or solicitation and procurement of insurance business.
                                </p>
                                <p>
                                    Please refer to BALIC Privacy Policy.
                                </p>
                            </div>
                            <button
                                onClick={() => { setShowTerms(false); setTermsAccepted(true); }}
                                className="w-full mt-6 py-3 bg-[#0066B2] text-white font-bold rounded-lg hover:bg-blue-700 transition-colors text-sm uppercase tracking-wider"
                            >
                                I Agree
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toast Notification */}
            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[120] px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 ${toast.type === 'error' ? 'bg-red-500 text-white' : 'bg-blue-600 text-white'
                            }`}
                    >
                        {toast.type === 'error' ? (
                            <X size={20} className="stroke-[3]" />
                        ) : (
                            <Check size={20} className="stroke-[3]" />
                        )}
                        <span className="font-bold text-sm">{toast.message}</span>
                    </motion.div>
                )}
            </AnimatePresence>

        </motion.div>
    );
});

IntroScreen.displayName = 'IntroScreen';

IntroScreen.propTypes = {
    onStart: PropTypes.func.isRequired,
};

export default IntroScreen;
