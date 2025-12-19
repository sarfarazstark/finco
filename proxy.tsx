import { NextRequest, NextResponse } from "next/server";

export function proxy(req: NextRequest) {
	if (req.url.endsWith('/')) {
		return NextResponse.redirect(new URL('/auth/login', req.url));
	}
}
