import { handleError } from '$lib/server/response';
import type { ITodo } from '$lib/models/todo';
import { GET } from '../api/todos/+server';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	try {
		const response = await GET(event);
		const responseBody = await response.json();
		event.depends('page:data');
		return {
			todos: (responseBody.data || []) as ITodo[],
		};
	} catch (err) {
		handleError(err);
	}
};
