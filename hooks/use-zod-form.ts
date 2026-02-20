'use client';

import { useState } from 'react';
import { ZodType } from 'zod';

type Errors = Record<string, string | undefined>;

export function useZodForm<T extends ZodType>(schema: T) {
	const [errors, setErrors] = useState<Errors>({});

	function parse(form: FormData) {
		const raw = Object.fromEntries(form.entries());
		const result = schema.safeParse(raw);

		if (!result.success) {
			const fieldErrors = result.error.flatten().fieldErrors;
			const mapped: Errors = {};

			for (const key in fieldErrors) {
				mapped[key] = fieldErrors[key]?.[0];
			}

			setErrors(mapped);
			return null;
		}

		setErrors({});
		return result.data;
	}

	return {
		errors,
		parse,
	};
}
