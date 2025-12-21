'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { motion } from 'motion/react';
import { login_schema } from '@/lib/schema';
import { useZodForm } from '@/hooks/use-zod-form';
import { useRouter } from 'next/navigation';
import axios, { AxiosError } from 'axios';
import toast from 'react-hot-toast';

export default function Login() {
	const { errors, parse } = useZodForm(login_schema);
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const formData = new FormData(e.target as HTMLFormElement);
		const data = parse(formData);
		if (!data) return;
		try {
			const response = await axios.post('/api/auth/login', data);
			toast.success(response.data.message || 'Login successful');
			router.push('/');
		} catch (error: AxiosError | unknown) {
			if (axios.isAxiosError(error)) {
				const errorMessage = error.response?.data.error || 'Login failed';
				toast.error(errorMessage);
			} else {
				toast.error('An unexpected error occurred');
			}
		}
	};

	return (
		<div className='h-full flex items-center justify-center'>
			<motion.div
				initial={{ opacity: 0, scale: 0.96 }}
				animate={{ opacity: 1, scale: 1 }}
				exit={{ opacity: 0, scale: 0.98 }}
				transition={{ duration: 0.25, ease: 'easeOut' }}
				className='min-w-md bg-white p-8 rounded-lg flex flex-col gap-5'>
				<h3 className='font-bold text-grey-900 font-preset-1'>Login</h3>
				<form onSubmit={handleSubmit} className='flex flex-col gap-5'>
					<Input
						label='Email'
						type='email'
						id='email'
						name='email'
						autoComplete='email'
						error={errors.email}
					/>
					<Input
						label='Password'
						type='password'
						id='password'
						name='password'
						autoComplete='off'
						error={errors.password}
					/>
					<Button type='submit'>Login</Button>
				</form>
				<div className='text-center text-grey-500'>
					Need to create an account?{' '}
					<Link href='/auth/signup' className='text-grey-900 underline ml-1'>
						Sign up
					</Link>
				</div>
			</motion.div>
		</div>
	);
}
