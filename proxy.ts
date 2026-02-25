import { NextRequest, NextResponse } from 'next/server';
import { betterFetch } from '@better-fetch/fetch';
import type { Session } from 'better-auth/types';
import { aj } from '@/lib/arcjet';

export const config = {
	matcher: ['/((?!_next/static|_next/image|favicon.ico|assets/|images/).*)'],
};

export async function proxy(req: NextRequest) {
	// 1. Run Arcjet Security Checks
	const decision = await aj.protect(req, { requested: 1 });

	if (decision.isDenied()) {
		if (decision.reason.isRateLimit()) {
			return new NextResponse('Too Many Requests', {
				status: 429,
				headers: {
					'Retry-After':
						decision.reason.resetTime?.toString() || '60',
				},
			});
		}
		return new NextResponse('Forbidden', { status: 403 });
	}

	// 2. Run Better-Auth route protection
	if (req.url.endsWith('/')) {
		const { data: session } = await betterFetch<Session>(
			'/api/auth/get-session',
			{
				baseURL: req.nextUrl.origin,
				headers: {
					cookie: req.headers.get('cookie') || '',
				},
			}
		);

		if (!session) {
			return NextResponse.redirect(new URL('/auth/login', req.url));
		}
	}

	return NextResponse.next();
}
