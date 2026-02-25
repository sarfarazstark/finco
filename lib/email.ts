import { BrevoClient } from '@getbrevo/brevo';

const brevo = new BrevoClient({
	apiKey: process.env.BREVO_API_KEY as string,
});

interface SendEmailProps {
	to: string;
	subject: string;
	htmlContent: string;
}

export const sendEmail = async ({
	to,
	subject,
	htmlContent,
}: SendEmailProps) => {
	try {
		const result = await brevo.transactionalEmails.sendTransacEmail({
			subject,
			htmlContent,
			sender: {
				name: 'Finco App',
				email: process.env.EMAIL_FROM as string,
			},
			to: [{ email: to }],
		});
		return { success: true, data: result };
	} catch (error) {
		console.error('Failed to send email:', error);
		return { success: false, error };
	}
};
