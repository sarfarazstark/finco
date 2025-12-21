import { NextResponse } from 'next/server';
import { login_schema } from '@/lib/schema';
import bcrypt from 'bcryptjs';
import { setSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const POST = async (req: Request) => {
	const body = await req.json();
	const { email, password } = login_schema.parse(body);

	const user = await prisma.user.findUnique({
		where: { email },
	});

	if (!user) {
		return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
	}

	const isPasswordValid = await bcrypt.compare(
		password,
		user.passwordHash || '',
	);

	if (!isPasswordValid) {
		return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
	}

	await setSessionUser(user);

	return NextResponse.json({ message: 'Logged in' }, { status: 200 });
};
