import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { emailOTP } from 'better-auth/plugins';
import { prisma } from './prisma';
import { sendEmail } from './email';
import {
	getOTPTemplate,
	getResetPasswordTemplate,
	getVerificationEmailTemplate,
} from './email-templates';

export const auth = betterAuth({
	database: prismaAdapter(prisma, {
		provider: 'postgresql',
	}),
	emailAndPassword: {
		enabled: true,
		requireEmailVerification: true,
		async sendResetPassword(data) {
			await sendEmail({
				to: data.user.email,
				subject: 'Reset your Finco password',
				htmlContent: getResetPasswordTemplate(data.url),
			});
		},
	},
	plugins: [
		emailOTP({
			async sendVerificationOTP({ email, otp }) {
				await sendEmail({
					to: email,
					subject: 'Verify your Finco email address',
					htmlContent: getOTPTemplate(otp),
				});
			},
			sendVerificationOnSignUp: true,
		}),
	],
	emailVerification: {
		sendVerificationEmail: async ({ user, url }) => {
			await sendEmail({
				to: user.email,
				subject: 'Verify your Finco email address',
				htmlContent: getVerificationEmailTemplate(url),
			});
		},
	},
});
