/**
 * Branded Email Templates for Finco
 * Designed to match the application's aesthetic:
 * - Background: #f8f4f0 (Beige 100)
 * - Text: #201f24 (Grey 900)
 * - Accent: #277c78 (Green/Teal)
 */

interface TemplateProps {
	title: string;
	content: string;
	buttonText?: string;
	buttonUrl?: string;
	footerText?: string;
}

const baseTemplate = ({
	title,
	content,
	buttonText,
	buttonUrl,
	footerText,
}: TemplateProps) => `
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>${title}</title>
	<style>
		body {
			font-family: 'Public Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
			background-color: #f8f4f0;
			color: #201f24;
			margin: 0;
			padding: 0;
			line-height: 1.6;
		}
		.container {
			max-width: 600px;
			margin: 40px auto;
			background-color: #ffffff;
			border-radius: 12px;
			overflow: hidden;
			box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
		}
		.header {
			background-color: #201f24;
			padding: 32px;
			text-align: center;
		}
		.logo {
			color: #ffffff;
			font-size: 24px;
			font-weight: 700;
			letter-spacing: -1px;
			text-decoration: none;
		}
		.content {
			padding: 40px;
		}
		h1 {
			font-size: 24px;
			font-weight: 700;
			margin-bottom: 24px;
			color: #201f24;
		}
		p {
			font-size: 16px;
			color: #696868;
			margin-bottom: 24px;
		}
		.otp-container {
			background-color: #f8f4f0;
			padding: 24px;
			border-radius: 8px;
			text-align: center;
			margin-bottom: 24px;
		}
		.otp-code {
			font-size: 40px;
			font-weight: 700;
			color: #277c78;
			letter-spacing: 8px;
		}
		.button {
			display: inline-block;
			background-color: #277c78;
			color: #ffffff !important;
			padding: 16px 32px;
			border-radius: 8px;
			font-weight: 700;
			text-decoration: none;
			text-align: center;
			transition: background-color 0.2s;
		}
		.footer {
			padding: 32px;
			background-color: #fafafa;
			border-top: 1px solid #e0e0e0;
			text-align: center;
			font-size: 12px;
			color: #8c8c8c;
		}
	</style>
</head>
<body>
	<div class="container">
		<div class="header">
			<div class="logo">finco</div>
		</div>
		<div class="content">
			<h1>${title}</h1>
			${content}
			${
				buttonText && buttonUrl
					? `
				<div style="text-align: center; margin-top: 32px;">
					<a href="${buttonUrl}" class="button">${buttonText}</a>
				</div>
			`
					: ''
			}
		</div>
		<div class="footer">
			<p style="margin: 0;">${footerText || '© 2026 Finco. All rights reserved.'}</p>
		</div>
	</div>
</body>
</html>
`;

export const getOTPTemplate = (otp: string) =>
	baseTemplate({
		title: 'Verify your email',
		content: `
		<p>Welcome to Finco! Please use the following verification code to complete your registration. This code is valid for 5 minutes.</p>
		<div class="otp-container">
			<div class="otp-code">${otp}</div>
		</div>
		<p>If you didn't request this email, you can safely ignore it.</p>
	`,
	});

export const getResetPasswordTemplate = (url: string) =>
	baseTemplate({
		title: 'Reset your password',
		content: `
		<p>We received a request to reset your Finco password. Click the button below to set a new one. This link is valid for a limited time.</p>
	`,
		buttonText: 'Reset Password',
		buttonUrl: url,
		footerText:
			"If you didn't request a password reset, please ignore this email or contact support if you have concerns.",
	});

export const getVerificationEmailTemplate = (url: string) =>
	baseTemplate({
		title: 'Confirm your email',
		content: `
		<p>Thanks for signing up for Finco! Please click the button below to verify your email address and get started.</p>
	`,
		buttonText: 'Verify Email',
		buttonUrl: url,
	});
