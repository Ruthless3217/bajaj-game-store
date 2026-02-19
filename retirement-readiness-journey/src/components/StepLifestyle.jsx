import React from 'react';
import { cn } from '../utils/cn';

const StepLifestyle = ({ step, selections, onSelect }) => {
    const currentSelection = selections[step.id];

    return (
        <div
            className="relative min-h-screen animate-in fade-in slide-in-from-bottom-4 duration-500"
            style={{
                backgroundImage: `url('./assests/Lifestyle Load.png')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
            }}
        >
            {/* Light overlay for readability */}
            <div className="absolute inset-0 bg-white/30" />

            {/* Content */}
            <div className="relative z-10 p-6 space-y-8">
                <div className="space-y-2">
                    <h2 className="text-[1.75rem] font-bold text-white drop-shadow-lg">{step.title}</h2>
                    <p className="text-white/90 text-[1rem] drop-shadow-md">{step.description}</p>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    {step.options.map((option) => (
                        <button
                            key={option.id}
                            onClick={() => onSelect(step.id, option.id)}
                            className={cn(
                                "relative flex items-center p-6 rounded-[1rem] border-2 transition-all duration-200 text-left backdrop-blur-md",
                                currentSelection === option.id
                                    ? "border-primary-500 bg-white/90 shadow-lg ring-1 ring-primary-500/20"
                                    : "border-white/40 bg-white/80 hover:bg-white/90 hover:shadow-md"
                            )}
                        >
                            <div className="w-[3.5rem] h-[3.5rem] bg-white rounded-[0.75rem] shadow-sm flex items-center justify-center text-[2rem] mr-6">
                                {option.icon}
                            </div>
                            <div className="flex-1">
                                <h3 className={cn(
                                    "text-[1.125rem] font-bold",
                                    currentSelection === option.id ? "text-primary-700" : "text-slate-900"
                                )}>
                                    {option.label}
                                </h3>
                                <p className="text-[0.875rem] text-slate-500 font-medium">{option.sublabel}</p>
                            </div>
                            {currentSelection === option.id && (
                                <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center shadow-sm">
                                    <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StepLifestyle;
