import arcjet, { shield, tokenBucket } from '@arcjet/next';

// This is our global Arcjet instance
// By default it looks for ARCJET_KEY in the environment
export const aj = arcjet({
	key: process.env.ARCJET_KEY!,
	characteristics: ['ip.src'],
	rules: [
		// Shield protects against common attacks like SQLi, XSS, and basic bots
		shield({
			mode: 'LIVE', // Blocks requests that rule triggers on
		}),
		// Global Token Bucket limit for all routes by default
		tokenBucket({
			mode: 'LIVE',
			refillRate: 50, // 50 requests
			interval: 60,   // every 60 seconds
			capacity: 100,  // burst up to 100
		}),
	],
});
