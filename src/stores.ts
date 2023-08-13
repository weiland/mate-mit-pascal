import { writable } from 'svelte/store';
import { localStore } from './localStore.ts';

export const isLoggedIn = localStore<boolean>('isLoggedIn', false);

export const myName = writable('Pascal');
