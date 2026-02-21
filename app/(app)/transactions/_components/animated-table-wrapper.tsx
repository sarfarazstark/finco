'use client';

import { motion, AnimatePresence } from 'motion/react';
import { useSearchParams } from 'next/navigation';
import { ReactNode, Suspense } from 'react';

function MotionWrapper({ children }: { children: ReactNode }) {
	const searchParams = useSearchParams();
	const key = searchParams.toString();

	return (
		<AnimatePresence mode="wait">
			<motion.div
				key={key}
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				exit={{ opacity: 0, y: -10 }}
				transition={{ duration: 0.2, ease: 'easeOut' }}
			>
				{children}
			</motion.div>
		</AnimatePresence>
	);
}

export function AnimatedTableWrapper({ children }: { children: ReactNode }) {
	return (
		<Suspense fallback={<div className="opacity-0">{children}</div>}>
			<MotionWrapper>{children}</MotionWrapper>
		</Suspense>
	);
}
