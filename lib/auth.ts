import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { emailOTP } from 'better-auth/plugins';
import { prisma } from './prisma';
import { sendEmail } from './email';

export const auth = betterAuth({
	database: prismaAdapter(prisma, {
		provider: 'postgresql',
	}),
	emailAndPassword: {
		enabled: true,
		requireEmailVerification: true,
		async sendResetPassword(data, request) {
			await sendEmail({
				to: data.user.email,
				subject: 'Reset your Finco password',
				htmlContent: `
					<h1>Reset Password</h1>
					<p>Click the link below to reset your password. This link is valid for a limited time.</p>
					<a href="${data.url}">Reset Password</a>
				`,
			});
		},
	},
	plugins: [
		emailOTP({
			async sendVerificationOTP({ email, otp, type }) {
				await sendEmail({
					to: email,
					subject: 'Verify your Finco email address',
					htmlContent: `
						<h1>Email Verification</h1>
						<p>Your verification code is: <strong>${otp}</strong></p>
						<p>Enter this code on the verification page to confirm your email.</p>
					`,
				});
			},
			sendVerificationOnSignUp: true,
		}),
	],
});
