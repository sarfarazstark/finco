'use client';

import { motion, AnimatePresence } from 'motion/react';
import { usePathname } from 'next/navigation';
import { LayoutRouterContext } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import React, { useContext, useState } from 'react';

function FrozenRouter(props: { children: React.ReactNode; }) {
	const context = useContext(LayoutRouterContext ?? {});

	const [frozen] = useState(context);

	return (
		<LayoutRouterContext.Provider value={frozen}>
			{props.children}
		</LayoutRouterContext.Provider>
	);
}

const variants = {
	initial: { opacity: 0, y: 20 },
	animate: { opacity: 1, y: 0 },
	exit: { opacity: 0, y: -20 }
};

export default function TransitionLayout({ children }: { children: React.ReactNode; }) {
	const pathname = usePathname();

	return (
		<AnimatePresence mode="wait">
			<motion.div
				key={pathname}
				initial="initial"
				animate="animate"
				exit="exit"
				variants={variants}
				transition={{ duration: 0.35, ease: "easeInOut" }}
			>
				<FrozenRouter>
					{children}
				</FrozenRouter>
			</motion.div>
		</AnimatePresence>
	);
}
