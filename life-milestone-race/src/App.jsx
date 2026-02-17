import { Suspense, lazy } from 'react';
import './index.css';

const LifeMilestoneRacePage = lazy(() =>
    import('./features/lifeMilestoneRace/LifeMilestoneRacePage')
);

/**
 * Root App component.
 * Lazy loads the game feature page for code splitting.
 */
function App() {
    return (
        <div className="h-[100dvh] w-full bg-race-dark overflow-hidden">
            <Suspense
                fallback={
                    <div className="h-[100dvh] w-full flex items-center justify-center bg-race-dark">
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-8 h-8 border-2 border-race-accent border-t-transparent rounded-full animate-spin" />
                            <span className="text-race-muted text-[0.875rem]">Loading...</span>
                        </div>
                    </div>
                }
            >
                <LifeMilestoneRacePage />
            </Suspense>
        </div>
    );
}

export default App;
