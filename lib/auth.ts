import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { User } from '@/lib/generated/prisma/client';
import { randomBytes } from 'crypto';

export async function getSessionUser() {
	const token = (await cookies()).get('session')?.value;

	if (!token) return null;

	const session = await prisma.session.findUnique({
		where: { sessionToken: token },
		include: { user: true },
	});

	if (!session) return null;

	if (session.expires < new Date()) {
		await prisma.session.delete({ where: { sessionToken: token } });
		return null;
	}

	return session.user;
}

export async function setSessionUser(user: User) {
	const sessionToken = randomBytes(32).toString('hex');

	await prisma.session.deleteMany({ where: { userId: user.id } });

	const expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);

	await prisma.session.create({
		data: {
			userId: user.id,
			sessionToken,
			expires,
		},
	});

	(await cookies()).set('session', sessionToken, {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'strict',
		expires,
		path: '/',
	});

	return sessionToken;
}
