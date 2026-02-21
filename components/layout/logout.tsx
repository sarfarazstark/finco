'use client';

import { useRouter } from 'next/navigation';
import { IconLogout } from '@tabler/icons-react';
import toast from 'react-hot-toast';
import { authClient } from '@/lib/auth-client';

const Logout = () => {
	const router = useRouter();

	const handleLogout = async () => {
		toast
			.promise(authClient.signOut(), {
				loading: 'Logging out...',
				success: 'Logged out successfully',
				error: 'Logout failed',
			})
			.then(() => {
				router.refresh();
				router.push('/auth/login');
			});
	};

	return (
		<button
			onClick={handleLogout}
			title="Logout"
			className="fixed top-2 right-2 z-50 bg-grey-100 rounded-full p-2 border border-grey-500/50 text-grey-900/70 hover:text-grey-900 transition-colors cursor-pointer"
		>
			<IconLogout />
		</button>
	);
};

export default Logout;
