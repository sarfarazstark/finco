import { NextRequest, NextResponse } from 'next/server';
import { betterFetch } from '@better-fetch/fetch';
import type { Session } from 'better-auth/types';

export async function proxy(req: NextRequest) {
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
