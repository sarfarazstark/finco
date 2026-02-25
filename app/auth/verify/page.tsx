'use client';
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { motion } from 'motion/react';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { authClient } from '@/lib/auth-client';
import { Suspense } from 'react';

function VerifyForm() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const email = searchParams.get('email') || '';
	const [otp, setOtp] = useState('');
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (!email) {
			router.push('/auth/login');
		}
	}, [email, router]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (otp.length !== 6) {
			toast.error('Please enter a 6-digit code');
			return;
		}

		try {
			setLoading(true);
			const { error } = await authClient.emailOtp.verifyEmail({
				email,
				otp,
			});

			if (error) {
				toast.error(error.message || 'Verification failed');
				setLoading(false);
				return;
			}

			toast.success('Email verified successfully! You can now log in.');
			router.push('/auth/login');
		} catch {
			toast.error('An unexpected error occurred');
			setLoading(false);
		}
	};

	const resendCode = async () => {
		try {
			const { error } = await authClient.emailOtp.sendVerificationOtp({
				email,
				type: 'email-verification',
			});
			if (error) {
				toast.error(error.message || 'Failed to resend code');
			} else {
				toast.success('Verification code resent to your email');
			}
		} catch {
			toast.error('Failed to resend code');
		}
	};

	if (!email) return null;

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
						Verify your email
					</h3>
					<p className="text-grey-500 text-sm">
						We sent a 6-digit code to <strong>{email}</strong>
					</p>
				</div>
				<form onSubmit={handleSubmit} className="flex flex-col gap-5">
					<Input
						label="Verification Code"
						type="text"
						id="otp"
						name="otp"
						value={otp}
						onChange={(e) => setOtp(e.target.value)}
						maxLength={6}
						placeholder="123456"
						autoComplete="one-time-code"
					/>
					<Button type="submit">
						{loading ? 'Verifying...' : 'Verify Email'}
					</Button>
				</form>
				<div className="text-center mt-2">
					<button
						type="button"
						onClick={resendCode}
						className="text-grey-500 text-sm hover:text-grey-900 underline underline-offset-4"
					>
						Didn`t receive a code? Resend
					</button>
				</div>
			</motion.div>
		</div>
	);
}

export default function Verify() {
	return (
		<Suspense fallback={<div className="h-full flex items-center justify-center">Loading...</div>}>
			<VerifyForm />
		</Suspense>
	);
}
