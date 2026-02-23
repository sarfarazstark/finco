import { auth } from '@/lib/auth';
import { User } from 'better-auth';
import { headers } from 'next/headers';

export async function useUser(): Promise<User | null> {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session?.user) {
		return null;
	}

	return session.user;
}
