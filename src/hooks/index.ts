import type { Handle } from '@sveltejs/kit';
import { connectMongoDB } from '$lib/helpers/db';
import { initModels } from '$lib/models';

connectMongoDB().then(() => {
	initModels();
});

export const handle: Handle = ({ event, resolve }) => {
	const response = resolve(event);
	return response;
};
