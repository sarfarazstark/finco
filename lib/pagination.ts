export type PaginationResult<T> = {
	data: T[];
	meta: {
		total: number;
		lastPage: number;
		currentPage: number;
		perPage: number;
		prev: number | null;
		next: number | null;
	};
};

/**
 * A Laravel Eloquent style pagination helper for Prisma.
 * @param model A prisma model instance (e.g. prisma.transaction)
 * @param args The findMany args (where, include, orderBy, etc.)
 * @param page The current page number
 * @param limit The number of items per page
 */
export async function paginate<
	Model extends {
		findMany: (args: never) => Promise<unknown[]>;
		count: (args: never) => Promise<number>;
	},
	Args extends Parameters<Model['findMany']>[0],
	Result extends Awaited<ReturnType<Model['findMany']>>,
>(
	model: Model,
	args: Args,
	page: number = 1,
	limit: number = 15
): Promise<PaginationResult<Result[number]>> {
	const skip = (page - 1) * limit;

	const [data, total] = await Promise.all([
		model.findMany({
			...((args as object) || {}),
			skip,
			take: limit,
		} as never),
		model.count({
			where: (args as { where?: unknown })?.where,
		} as never),
	]);

	const lastPage = Math.ceil(total / limit);

	return {
		data: data as Result,
		meta: {
			total,
			lastPage,
			currentPage: page,
			perPage: limit,
			prev: page > 1 ? page - 1 : null,
			next: page < lastPage ? page + 1 : null,
		},
	};
}
