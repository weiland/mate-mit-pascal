/// <reference types="npm:vite@^4.0.0/client" />
export const DEFAULT_NAME = import.meta.env.VITE_NAME ?? (import.meta.env.NAME ?? 'Pasci');
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

export const namesMap  = {
	amount: '🔄',
	name: '🫵',
	drink: '🧉',
	when: '⌚️',
	where: '📍',
	extra: '✏️',
	horny: '🍆',
};

export type NamesMapKeys = keyof typeof namesMap;

export const DEFAULT_STATE: NamesMapKeys = 'drink';

export const API_BASE_URL = `${import.meta.env.VITE_API_HOST ?? (Deno.env.get('API_HOST') ?? '')}/api`;
export const MEETINGS_API_URL = `${API_BASE_URL}/meetings`;

