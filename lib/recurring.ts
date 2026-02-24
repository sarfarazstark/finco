/**
 * Check if a date falls within the current period
 * Weekly: same calendar week (Monday to Sunday)
 * Monthly: same month and year
 * Yearly: same year
 */
export function isInCurrentPeriod(
	txDate: Date,
	frequency: number | null,
	now: Date
): boolean {
	if (!frequency) return false;

	if (frequency <= 7) {
		const startOfWeek = new Date(now);
		const day = startOfWeek.getDay();
		const diff = day === 0 ? 6 : day - 1;
		startOfWeek.setDate(startOfWeek.getDate() - diff);
		startOfWeek.setHours(0, 0, 0, 0);

		const endOfWeek = new Date(startOfWeek);
		endOfWeek.setDate(endOfWeek.getDate() + 7);

		return txDate >= startOfWeek && txDate < endOfWeek;
	}

	if (frequency <= 30) {
		return (
			txDate.getMonth() === now.getMonth() &&
			txDate.getFullYear() === now.getFullYear()
		);
	}

	if (frequency <= 90) {
		const txQuarter = Math.floor(txDate.getMonth() / 3);
		const nowQuarter = Math.floor(now.getMonth() / 3);
		return (
			txQuarter === nowQuarter &&
			txDate.getFullYear() === now.getFullYear()
		);
	}

	return txDate.getFullYear() === now.getFullYear();
}

/**
 * Check if the period is ending soon and no transaction has been made
 */
export function checkDueSoon(
	lastDate: Date,
	frequency: number | null,
	now: Date
): boolean {
	if (!frequency) return false;

	const daysSinceLast =
		(now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24);

	if (daysSinceLast >= frequency) return true;

	const daysRemaining = frequency - daysSinceLast;
	return daysRemaining <= 5;
}
