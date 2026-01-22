import React, { useEffect, useState } from 'react';
import { useProgress } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';

const LoadingScreen = () => {
    const { progress } = useProgress();
    const [show, setShow] = useState(true);

    // Smoothly fade out when loading is complete
    useEffect(() => {
        if (progress === 100) {
            // Add a small delay to ensure everything is settled
            const timer = setTimeout(() => {
                setShow(false);
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [progress]);

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background"
                >
                    <div className="w-64 space-y-4">
                        <h2 className="text-2xl font-bold text-center text-primary tracking-widest">
                            INITIALIZING
                        </h2>

                        <div className="h-2 w-full bg-secondary overflow-hidden rounded-full">
                            <motion.div
                                className="h-full bg-primary"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 0.1 }}
                            />
                        </div>

                        <p className="text-right text-sm text-muted-foreground font-mono">
                            {Math.round(progress)}%
                        </p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default LoadingScreen;
