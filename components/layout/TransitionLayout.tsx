'use client';

import { motion, AnimatePresence, useIsPresent } from 'motion/react';
import { usePathname } from 'next/navigation';
import { LayoutRouterContext } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import React, { useContext } from 'react';
import { ScrollArea } from '../ui/scroll-area';
function FrozenRouter(props: { children: React.ReactNode }) {
	const context = useContext(LayoutRouterContext ?? {});
	const isPresent = useIsPresent();
	const [frozenContext, setFrozenContext] = React.useState(context);

	React.useEffect(() => {
		if (isPresent) {
			setFrozenContext(context);
		}
	}, [context, isPresent]);

	return (
		<LayoutRouterContext.Provider
			value={isPresent ? context : frozenContext}
		>
			{props.children}
		</LayoutRouterContext.Provider>
	);
}

const variants = {
	initial: { opacity: 0, y: 20 },
	animate: { opacity: 1, y: 0 },
	exit: { opacity: 0, y: -20 },
};

export default function TransitionLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const pathname = usePathname();

	return (
		<AnimatePresence mode="wait">
			<motion.div
				key={pathname}
				initial="initial"
				animate="animate"
				exit="exit"
				variants={variants}
				transition={{ duration: 0.35, ease: 'easeInOut' }}
				className="h-full overflow-y-auto overflow-x-hidden"
			>
				<ScrollArea>
					<FrozenRouter>{children}</FrozenRouter>
				</ScrollArea>
			</motion.div>
		</AnimatePresence>
	);
}
