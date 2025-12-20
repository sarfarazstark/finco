import * as z from 'zod/v4';

const passwordSchema = z
	.string()
	.min(8, 'Password must be at least 8 characters long.')
	.max(128, 'Password is too long.')
	.regex(/[a-z]/, 'Must contain at least one lowercase letter.')
	.regex(/[A-Z]/, 'Must contain at least one uppercase letter.')
	.regex(/\d/, 'Must contain at least one digit.')
	.regex(/[^A-Za-z0-9]/, 'Must contain at least one special character.');

export const login_schema = z.object({
	email: z.email(),
	password: passwordSchema,
});

export const signup_schema = login_schema.extend({
	name: z.string().min(2, 'Name must be at least 2 characters long.'),
	email: z.email(),
	password: passwordSchema,
});
