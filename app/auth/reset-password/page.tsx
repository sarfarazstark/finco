'use client';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { motion } from 'motion/react';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { authClient } from '@/lib/auth-client';
import { Suspense } from 'react';

function ResetPasswordForm() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const token = searchParams.get('token') || '';

	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e: React.SubmitEvent) => {
		e.preventDefault();
		if (password.length < 8) {
			toast.error('Password must be at least 8 characters');
			return;
		}

		if (password !== confirmPassword) {
			toast.error('Passwords do not match');
			return;
		}

		try {
			setLoading(true);
			const { error } = await authClient.resetPassword({
				newPassword: password,
				token,
			});

			if (error) {
				toast.error('This reset link is invalid or has expired. Please request a new one.');
				setLoading(false);
				return;
			}

			toast.success('Your password has been successfully updated! You can now log in.');
			router.push('/auth/login');
		} catch {
			toast.error('Something went wrong on our end. Please try again.');
			setLoading(false);
		}
	};

	if (!token) {
		return (
			<div className="h-full flex items-center justify-center">
				<div className="bg-white p-8 rounded-lg mx-4 max-w-sm text-center">
					<p className="text-red font-bold mb-4">Invalid or missing reset token.</p>
					<p className="text-grey-500 text-sm mb-6 text-pretty">The link you followed may be invalid or expired. Please request a new password reset link.</p>
					<Button className="w-full" onClick={() => router.push('/auth/forgot-password')}>
						Go back to Reset Password
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className="h-full flex items-center justify-center">
			<motion.div
				initial={{ opacity: 0, scale: 0.96 }}
				animate={{ opacity: 1, scale: 1 }}
				exit={{ opacity: 0, scale: 0.98 }}
				transition={{ duration: 0.25, ease: 'easeOut' }}
				className="min-w-[400px] max-w-md w-full bg-white p-8 rounded-lg flex flex-col gap-5 mx-4"
			>
				<div>
					<h3 className="font-bold text-grey-900 font-preset-1 mb-2">
						Set New Password
					</h3>
					<p className="text-grey-500 text-sm">
						Your new password must be at least 8 characters long.
					</p>
				</div>
				<form onSubmit={handleSubmit} className="flex flex-col gap-5">
					<div className="flex flex-col gap-5">
						<Input
							label="New Password"
							type="password"
							id="password"
							name="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							autoComplete="new-password"
						/>
						<Input
							label="Confirm Password"
							type="password"
							id="confirmPassword"
							name="confirmPassword"
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
							autoComplete="new-password"
						/>
					</div>
					<Button type="submit">
						{loading ? 'Resetting...' : 'Reset Password'}
					</Button>
				</form>
			</motion.div>
		</div>
	);
}

export default function ResetPassword() {
	return (
		<Suspense fallback={<div className="h-full flex items-center justify-center">Loading...</div>}>
			<ResetPasswordForm />
		</Suspense>
	);
}
