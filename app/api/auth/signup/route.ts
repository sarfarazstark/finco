import { NextResponse } from 'next/server';
import { signup_schema } from '@/lib/schema';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { setSessionUser } from '@/lib/auth';

export const POST = async (req: Request) => {
	try {
		const body = await req.json();
		const { email, password, name } = signup_schema.parse(body);

		const existing = await prisma.user.findUnique({ where: { email } });

		if (existing) {
			return NextResponse.json(
				{ error: 'Email already registered' },
				{ status: 409 },
			);
		}

		const passwordHash = await bcrypt.hash(password, 10);

		const user = await prisma.user.create({
			data: {
				email,
				passwordHash,
				name,
			},
		});

		await setSessionUser(user);

		return NextResponse.json({ message: 'Signup successful' }, { status: 201 });
	} catch (err) {
		return NextResponse.json(
			{ error: 'Invalid data or server error', details: err },
			{ status: 500 },
		);
	}
};
