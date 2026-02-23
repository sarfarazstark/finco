'use server';

import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { budgetSchema } from '@/lib/schema';
import { z } from 'zod/v4';

export type BudgetPayload = z.infer<typeof budgetSchema>;
