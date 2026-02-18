import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, RotateCcw, Phone, Calendar, Clock, X, CheckCircle2, ChevronDown, Share2, ShieldCheck, Medal, Star, AlertCircle } from "lucide-react";
import ScoreCard from './ScoreCard';
import Confetti from './Confetti';
import * as Dialog from '@radix-ui/react-dialog';
import { useQuiz } from '../context/QuizContext';

const ResultsScreen = ({ score, total, onRestart }) => {
    const { leadName, leadPhone, handleBookingSubmit, isTermsAccepted } = useQuiz();
    const percentage = (score / total) * 100;
    const today = new Date().toISOString().split("T")[0];
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    const maxDate = thirtyDaysFromNow.toISOString().split("T")[0];

    const [isBookingOpen, setIsBookingOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [bookingTermsAccepted, setBookingTermsAccepted] = useState(isTermsAccepted);
    const [bookingData, setBookingData] = useState({
        name: leadName || '',
        mobile_no: leadPhone || '',
        date: '',
        timeSlot: ''
    });
    const [errors, setErrors] = useState({});

    const timeSlots = [
        "10:00 AM - 12:00 PM",
        "12:00 PM - 02:00 PM",
        "02:00 PM - 04:00 PM",
        "04:00 PM - 06:00 PM"
    ];

    const handleShare = async () => {
        const shareMessage = `I scored ${score}/${total} on the GST Quiz! 🏆 Check your GST knowledge here:`;
        const shareUrl = window.location.href;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'GST Quiz',
                    text: shareMessage,
                    url: shareUrl,
                });
            } catch (error) {
                console.log('Error sharing:', error);
            }
        } else {
            // Fallback: Copy to clipboard
            try {
                const fullText = `${shareMessage} ${shareUrl}`;
                await navigator.clipboard.writeText(fullText);
                alert('Score and link copied to clipboard!');
            } catch (err) {
                console.error('Failed to copy text: ', err);
            }
        }
    };

    const validate = () => {
        const errs = {};
        if (!bookingData.name.trim()) {
            errs.name = "Name is required";
        } else if (!/^[A-Za-z\s]+$/.test(bookingData.name.trim())) {
            errs.name = "Letters only";
        }

        if (!bookingData.mobile_no.trim()) {
            errs.mobile_no = "Mobile is required";
        } else if (!/^[6-9]\d{9}$/.test(bookingData.mobile_no)) {
            errs.mobile_no = "Invalid 10-digit number";
        }

        if (!bookingData.date) {
            errs.date = "Select a date";
        }
        if (!bookingData.timeSlot) {
            errs.timeSlot = "Select a slot";
        }
        if (!bookingTermsAccepted) {
            errs.terms = "Accept terms";
        }

        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setIsSubmitting(true);
        const result = await handleBookingSubmit({
            ...bookingData,
            booking_timestamp: new Date().toISOString()
        });
        setIsSubmitting(false);

        if (result.success) {
            setIsBookingOpen(false);
        } else {
            setErrors({ submit: result.error || 'Failed to book slot. Please try again.' });
        }
    };

    // Custom title based on score
    const getResultTitle = (currentScore) => {
        if (currentScore === 0) return "Learning Begins";
        if (currentScore <= 2) return "Keep Going";
        if (currentScore <= 3) return "Good Attempt";
        if (currentScore === 4) return "Well Done";
        return "Outstanding";
    };

    // Custom motivational message based on score
    const getMotivationalMessage = (currentScore) => {
        if (currentScore === 0) return "No worries — Let’s try again!";
        if (currentScore <= 2) return "Not quite there yet — You can do better!";
        if (currentScore <= 3) return "Good effort — You can do better!";
        if (currentScore === 4) return "You’ve learned important financial and insurance concepts.";
        return "Excellent! You are a GST expert!";
    };

    // Dynamic achievement icon
    const getAchievementIcon = (currentScore) => {
        if (currentScore === 0) return <AlertCircle className="w-10 h-10 text-brand-orange" strokeWidth={1.5} />;
        if (currentScore <= 2) return <Star className="w-10 h-10 text-brand-orange" strokeWidth={1.5} />;
        if (currentScore <= 4) return <Medal className="w-10 h-10 text-brand-orange" strokeWidth={1.5} />;
        return <Trophy className="w-10 h-10 text-brand-orange" strokeWidth={1.5} />;
    };

    return (
        <motion.div
            className="w-full h-full flex flex-col justify-between py-4 px-2 text-center relative"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
        >
            {/* Top Right Share Icon - SHARP EDGES */}
            <button
                onClick={handleShare}
                className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-none text-white transition-colors z-10"
                aria-label="Share results"
            >
                <Share2 className="w-5 h-5" />
            </button>
            {percentage >= 60 && <Confetti />}

            <div className="flex-1 flex flex-col justify-center space-y-4">
                <div className="flex justify-center pt-0 flex-col items-center">
                    <p className="text-white font-bold text-2xl mb-4">
                        Hi <span className="text-brand-orange font-black">{leadName ? leadName : 'Friend'}</span>
                    </p>
                    <motion.div
                        animate={{ rotate: [0, -5, 5, -5, 5, 0] }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                        className="p-2 bg-white border-4 border-brand-orange shadow-sm rounded-none"
                    >
                        {getAchievementIcon(score)}
                    </motion.div>
                </div>

                <div className="space-y-2">
                    <h2 className="text-3xl font-black text-white tracking-tight leading-none">
                        {getResultTitle(score)}
                    </h2>
                    <div className="bg-brand-orange text-white text-[10px] font-black py-1.5 px-4 inline-block shadow-sm">
                        {getMotivationalMessage(score)}
                    </div>
                </div>

                <div className="py-1">
                    <ScoreCard score={score} total={total} />
                </div>

            </div>

            <div className="mt-2 flex flex-col items-center gap-4">
                {/* Top Share Button */}
                <button
                    onClick={handleShare}
                    className="game-btn-orange text-lg py-2.5 px-12 flex items-center justify-center gap-2 shadow-[0px_4px_0px_0px_rgba(194,65,12,1)] uppercase font-black rounded-none"
                >
                    <Share2 className="w-5 h-5 flex-shrink-0" />
                    <span>SHARE</span>
                </button>

                {/* Glassmorphic Action Card - SHARP EDGES */}
                <div className="bg-white/10 border-2 border-white/20 backdrop-blur-xl rounded-none p-6 w-full max-w-[400px] shadow-2xl relative overflow-hidden ring-1 ring-white/10">
                    <p className="text-white text-xs font-bold text-center mb-6 px-2 opacity-90">
                        To Know more about insurance and savings products! Connect with our Relationship Manager to get started.
                    </p>

                    <div className="space-y-3">
                        <a
                            href="tel:18002097272"
                            className="w-full bg-[#0066B2] hover:bg-[#005a9e] text-white text-lg py-3.5 flex items-center justify-center gap-2 rounded-none shadow-[0px_3px_0px_0px_rgba(30,58,138,1)] uppercase font-black transition-colors"
                        >
                            <Phone className="w-5 h-5 flex-shrink-0" />
                            <span>CALL NOW</span>
                        </a>

                        <div className="flex items-center justify-center gap-4">
                            <div className="h-[1px] bg-white/10 flex-1"></div>
                            <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">OR</span>
                            <div className="h-[1px] bg-white/10 flex-1"></div>
                        </div>

                        <button
                            onClick={() => setIsBookingOpen(true)}
                            className="w-full game-btn-orange text-[14px] sm:text-lg py-3.5 flex items-center justify-center gap-2 rounded-none shadow-[0px_3px_0px_0px_rgba(194,65,12,1)] uppercase font-black transition-all whitespace-nowrap"
                        >
                            <Calendar className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                            <span>BOOK A CONVENIENT SLOT</span>
                        </button>
                    </div>
                </div>

                <button
                    onClick={onRestart}
                    className="w-full max-w-[400px] border-2 border-white/30 hover:bg-white/10 text-white font-black py-4 flex items-center justify-center gap-3 transition-all active:scale-95 text-lg"
                >
                    <RotateCcw className="w-5 h-5" />
                    <span>Retake Quiz</span>
                </button>
            </div>

            {/* Booking Modal */}
            <Dialog.Root open={isBookingOpen} onOpenChange={setIsBookingOpen}>
                <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 bg-black/70 backdrop-blur-md z-50" />
                    <Dialog.Content asChild>
                        <div className="fixed inset-0 z-50 grid place-items-center p-4">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                className="bg-white/10 border-2 border-white/20 backdrop-blur-2xl rounded-[2rem] p-8 w-full max-w-md shadow-2xl relative overflow-hidden my-auto"
                            >
                                <button
                                    onClick={() => setIsBookingOpen(false)}
                                    className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
                                >
                                    <X className="w-6 h-6" />
                                </button>

                                <Dialog.Title className="text-2xl font-black text-white text-center mb-1 uppercase tracking-tight">
                                    Book a Slot
                                </Dialog.Title>
                                <Dialog.Description className="sr-only">
                                    Choose your preferred date and time for a callback from our relationship manager.
                                </Dialog.Description>
                                <p className="text-center text-white/60 text-[10px] font-black uppercase tracking-widest mb-8">
                                    Pick your preferred time
                                </p>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black text-white/70 uppercase tracking-widest ml-1">Name</label>
                                            <input
                                                type="text"
                                                value={bookingData.name}
                                                onChange={(e) => {
                                                    const val = e.target.value.replace(/[^a-zA-Z\s]/g, '');
                                                    setBookingData(prev => ({ ...prev, name: val }));
                                                    if (!val.trim()) setErrors(prev => ({ ...prev, name: "Name is required" }));
                                                    else setErrors(prev => ({ ...prev, name: null }));
                                                }}
                                                placeholder="Your name"
                                                className={`w-full bg-white/5 border-2 ${errors.name ? 'border-red-400' : 'border-white/10'} rounded-xl px-4 py-3 text-white font-bold focus:outline-none focus:border-brand-orange/50 transition-colors`}
                                            />
                                            {errors.name && <p className="text-red-400 text-[9px] font-black uppercase tracking-wider ml-1 mt-1">{errors.name}</p>}
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black text-white/70 uppercase tracking-widest ml-1">Phone</label>
                                            <input
                                                type="text"
                                                value={bookingData.mobile_no}
                                                onChange={(e) => {
                                                    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                                                    setBookingData(prev => ({ ...prev, mobile_no: val }));
                                                    if (!val.trim()) setErrors(prev => ({ ...prev, mobile_no: "Mobile is required" }));
                                                    else if (val.length > 0 && val.length < 10) setErrors(prev => ({ ...prev, mobile_no: "Enter 10 digits" }));
                                                    else if (val.length === 10 && !/^[6-9]/.test(val)) setErrors(prev => ({ ...prev, mobile_no: "Must start 6-9" }));
                                                    else setErrors(prev => ({ ...prev, mobile_no: null }));
                                                }}
                                                placeholder="10-digit number"
                                                className={`w-full bg-white/5 border-2 ${errors.mobile_no ? 'border-red-400' : 'border-white/10'} rounded-xl px-4 py-3 text-white font-bold focus:outline-none focus:border-brand-orange/50 transition-colors`}
                                            />
                                            {errors.mobile_no && <p className="text-red-400 text-[9px] font-black uppercase tracking-wider ml-1 mt-1">{errors.mobile_no}</p>}
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-white/70 uppercase tracking-widest ml-1">Select Date</label>
                                        <div className="relative">
                                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-orange" />
                                            <input
                                                type="date"
                                                value={bookingData.date}
                                                min={today}
                                                max={maxDate}
                                                onChange={(e) => {
                                                    setBookingData(prev => ({ ...prev, date: e.target.value }));
                                                    setErrors(prev => ({ ...prev, date: null }));
                                                }}
                                                className={`w-full bg-white/10 border-2 ${errors.date ? 'border-red-400' : 'border-white/20'} rounded-xl pl-11 pr-4 py-3 text-white font-bold focus:outline-none focus:border-brand-orange/50 transition-colors [color-scheme:dark]`}
                                            />
                                        </div>
                                        {errors.date && <p className="text-red-400 text-[10px] font-black uppercase tracking-wider ml-1 mt-1">{errors.date}</p>}
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-white/70 uppercase tracking-widest ml-1">Select Time Slot</label>
                                        <div className="relative">
                                            <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-orange" />
                                            <select
                                                value={bookingData.timeSlot}
                                                onChange={(e) => {
                                                    setBookingData(prev => ({ ...prev, timeSlot: e.target.value }));
                                                    setErrors(prev => ({ ...prev, timeSlot: null }));
                                                }}
                                                className={`w-full bg-white/10 border-2 ${errors.timeSlot ? 'border-red-400' : 'border-white/20'} rounded-xl pl-11 pr-10 py-3 text-white font-bold focus:outline-none focus:border-brand-orange/50 transition-colors appearance-none`}
                                            >
                                                <option value="" className="bg-zinc-900">Choose a slot</option>
                                                {timeSlots.map(slot => (
                                                    <option key={slot} value={slot} className="bg-zinc-900">{slot}</option>
                                                ))}
                                            </select>
                                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
                                        </div>
                                        {errors.timeSlot && <p className="text-red-400 text-[10px] font-black uppercase tracking-wider ml-1 mt-1">{errors.timeSlot}</p>}
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-start gap-3 group cursor-pointer" onClick={() => {
                                            setBookingTermsAccepted(!bookingTermsAccepted);
                                            setErrors(prev => ({ ...prev, terms: null }));
                                        }}>
                                            <div className={`shrink-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${bookingTermsAccepted ? 'bg-brand-orange border-brand-orange' : 'border-white/30 bg-white/5'}`}>
                                                {bookingTermsAccepted && <ShieldCheck className="w-4 h-4 text-white" />}
                                            </div>
                                            <div className="text-[11px] text-white/80 font-bold leading-tight uppercase">
                                                I accept the Terms & Conditions and acknowledge the privacy policy.
                                            </div>
                                        </div>
                                        {errors.terms && <p className="text-red-400 text-[10px] font-black uppercase tracking-wider ml-1">{errors.terms}</p>}
                                    </div>

                                    {errors.submit && (
                                        <p className="text-red-400 text-xs font-black text-center uppercase">{errors.submit}</p>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full game-btn-orange text-xl py-4 shadow-[0px_6px_0px_0px_rgba(194,65,12,1)] disabled:opacity-50 disabled:translate-y-1 disabled:shadow-none transition-all"
                                    >
                                        {isSubmitting ? 'BOOKING...' : 'CONFIRM BOOKING'}
                                    </button>
                                </form>
                            </motion.div>
                        </div>
                    </Dialog.Content>

                </Dialog.Portal>
            </Dialog.Root>
        </motion.div>
    );
};

export default ResultsScreen;
