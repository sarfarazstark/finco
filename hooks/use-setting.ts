import { prisma } from '@/lib/prisma';

export const getSetting = async (userId: string) => {
	return (
		(await prisma.setting.findUnique({
			where: {
				userId,
			},
		})) ?? {
			currency: 'INR',
			id: '',
			userId: '',
			theme: 'light',
			createdAt: new Date(),
			updatedAt: new Date(),
		}
	);
};
