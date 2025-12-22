import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
	const cookie = await cookies();

	const token = cookie.get('session')?.value;

	if (token) {
		await prisma.session.deleteMany({ where: { sessionToken: token } });
	}

	cookie.set('session', '', {
		httpOnly: true,
		expires: new Date(0),
		path: '/',
	});

	return NextResponse.json({ message: 'Logged out' });
}
