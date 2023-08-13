export const DEFAULT_NAME = import.meta.env.VITE_NAME ?? 'Pasci';
export const OTHER_DRINK = 'other';
export const DRINKS = [
	'Traditional Mate 🧉',
	'Flora Power',
	'Club-Mate',
	// 'Sperma',
	'Premium Cola',
	'Tschunk',
	'Virgin Tschunk',
	'Cocktail',
	'Water (laut)',
	'Water (leise)',
	'🚬-Wasser', // :c
	OTHER_DRINK,
];

export function getDefaultDrink(): string {
	// TOOD(pascal): first check caffeine hour
	// TODO(pascal): then check temperature

	return DRINKS[0];
}

export const namesMap = {
	amount: '🔄',
	name: '🫵',
	drink: '🧉',
	when: '⌚️',
	where: '📍',
	extra: '✏️',
	pleading: '🥺',
	horny: '🍆',
};

export type NamesMapKeys = keyof typeof namesMap;

export const DEFAULT_STATE: NamesMapKeys = 'drink';

const API_HOST = import.meta.env.VITE_API_HOST ?? '';
export const API_BASE_URL = `${API_HOST}/api`;
export const MEETINGS_API_URL = `${API_BASE_URL}/meetings`;

export const PUBLIC_KEY =
	'BNNgw7qhfBReZAmMtBaFSWWvG8NsytPFJvNnSsz3I31xg10hjDYvN7UkV4RY-cyOi8JLfraAEH78PuGBF7zkfRA';
