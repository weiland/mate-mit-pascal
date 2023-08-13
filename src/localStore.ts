import { writable } from 'svelte/store';

type Key = string;

// type Value = string|number|object;

// interface Parse { ( text: string ): Value }
// type Writable = { subscribe: Function, set: Function, update: Function };
// interface LocalStore { (key: Key, initial: Value ): Writable}

export const localStore = <ValueType>(key: Key, initial: ValueType) => {
	const serialize = (value: ValueType) => JSON.stringify(value, null, 2);
	const toObj: { (text: string): ValueType } = (text) => JSON.parse(text);

	if (localStorage.getItem(key) === null) {
		localStorage.setItem(key, serialize(initial));
	}

	const item = localStorage.getItem(key);
	if (item === null) {
		console.error('Could not initialize localStore with key:', key);
		return;
	}

	const saved = toObj(item);

	const { subscribe, set, update } = writable(saved);

	return {
		subscribe,
		set: (value: ValueType) => {
			localStorage.setItem(key, serialize(value));
			return set(value);
		},
		update,
	};
};
