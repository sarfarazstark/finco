'use client';

import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { IconX, IconPlus } from '@tabler/icons-react';
import { useState } from 'react';
import { CreateCategoryDialog } from './create-category-dialog';
import { Icon } from '@prisma/client';

export type Category = {
	id: string;
	name: string;
	icon: string;
	color: string;
};

export function CategorySelectorOverlay({
	open,
	onClose,
	onSelect,
	categories,
	dbIcons,
}: {
	open: boolean;
	onClose: () => void;
	onSelect: (category: Category) => void;
	categories: Category[];
	dbIcons?: Icon[];
}) {
	const [isCreateOpen, setIsCreateOpen] = useState(false);

	return (
		<>
			<AnimatePresence>
				{open && (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: 20 }}
						transition={{ duration: 0.2, ease: 'easeOut' }}
						className="absolute inset-0 z-50 bg-white rounded-xl flex flex-col overflow-hidden"
					>
						<div className="flex items-center justify-between p-4 border-b border-grey-100 shrink-0">
							<h3 className="text-xl font-bold font-preset-4 text-grey-900 tracking-tight pl-2">
								Select Category
							</h3>
							<button
								type="button"
								onClick={onClose}
								className="w-9 h-9 rounded-full bg-grey-50 flex items-center justify-center text-grey-500 hover:bg-grey-100 hover:text-grey-900 transition-colors"
							>
								<IconX className="w-5 h-5" />
							</button>
						</div>

						<div className="flex-1 overflow-y-auto p-4 pt-6">
							<div className="grid grid-cols-4 gap-x-3 gap-y-5">
								{categories.map(cat => (
									<button
										key={cat.id}
										type="button"
										onClick={() => onSelect(cat)}
										className="flex flex-col items-center justify-start gap-2 p-2 rounded-2xl hover:bg-grey-50 transition-colors group cursor-pointer"
									>
										<div
											className={cn(
												'w-10 h-10 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-105 group-active:scale-95',
												cat.color
											)}
										>
											<i
												className={`ti ti-${cat.icon} text-white text-xl`}
											/>
										</div>
										<span className="text-[10px] text-grey-600 text-center tracking-widest px-1">
											{cat.name}
										</span>
									</button>
								))}

								<button
									type="button"
									onClick={() => setIsCreateOpen(true)}
									className="flex flex-col items-center justify-start gap-2 p-2 rounded-2xl hover:bg-grey-50 transition-colors group cursor-pointer"
								>
									<div className="w-10 h-10 rounded-full flex items-center justify-center border-2 border-dashed border-grey-300 text-grey-500 transition-all duration-300 group-hover:border-grey-900 group-hover:text-grey-900 group-hover:scale-105 group-active:scale-95">
										<IconPlus className="w-5 h-5" />
									</div>
									<span className="text-[10px] text-grey-600 text-center tracking-widest px-1">
										New Category
									</span>
								</button>
							</div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
			<CreateCategoryDialog
				open={isCreateOpen}
				onOpenChange={setIsCreateOpen}
				dbIcons={dbIcons || []}
			/>
		</>
	);
}
