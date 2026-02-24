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
	password: z.string(),
});

export const signup_schema = login_schema.extend({
	name: z.string().min(2, 'Name must be at least 2 characters long.'),
	email: z.string().email('Invalid email address'),
	password: passwordSchema,
});

export const transactionSchema = z
	.object({
		type: z.enum(['INCOME', 'EXPENSE', 'TRANSFER']),
		amount: z.number().positive('Amount must be greater than zero'),
		name: z.string().min(1, 'Name is required').max(100),
		date: z.date(),
		accountId: z.string().min(1, 'Account is required'),
		categoryId: z.string().nullable().optional(),
		toAccountId: z.string().nullable().optional(),
		recurring: z.boolean().optional(),
		frequency: z.number().int().positive().optional(),
	})
	.refine(
		data => {
			if (data.type === 'TRANSFER' && !data.toAccountId) {
				return false;
			}
			return true;
		},
		{
			message: 'Destination account is required for transfers',
			path: ['toAccountId'],
		}
	)
	.refine(
		data => {
			if (
				data.type === 'TRANSFER' &&
				data.accountId === data.toAccountId
			) {
				return false;
			}
			return true;
		},
		{
			message: 'Cannot transfer to the same account',
			path: ['toAccountId'],
		}
	)
	.refine(
		data => {
			if (
				(data.type === 'INCOME' || data.type === 'EXPENSE') &&
				!data.categoryId
			) {
				return false;
			}
			return true;
		},
		{
			message: 'Category is required for income and expense',
			path: ['categoryId'],
		}
	);

export const settingsSchema = z.object({
	currency: z.string().min(1, 'Currency is required').max(10),
	theme: z.string().min(1, 'Theme is required').max(20),
});

export const budgetSchema = z.object({
	categoryId: z.string().min(1, 'Category is required'),
	themeId: z.string().min(1, 'Theme is required'),
	maximum: z.number().min(1, 'Maximum amount must be greater than 0'),
	type: z.enum(['WEEKLY', 'MONTHLY', 'QUARTERLY', 'YEARLY']),
});

export const potSchema = z.object({
	id: z.string().optional(),
	name: z.string().min(1, 'Name is required').max(100),
	target: z.number().positive('Amount must be greater than zero'),
	themeId: z.string().min(1, 'Theme is required'),
});
