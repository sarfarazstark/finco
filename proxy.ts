import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';

export async function proxy(req: NextRequest) {
	const user = await getSessionUser();
	if (req.url.endsWith('/') && !user) {
		return NextResponse.redirect(new URL('/auth/login', req.url));
	}
}
