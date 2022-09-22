import { base } from '$app/paths';
import { toJSON } from '$lib/helpers/common/object';
import { handleError, successRes } from '$lib/helpers/server/response';
import { Todo } from '$lib/models/todo';
import type { ITodo } from '$lib/models/todo';
import { error } from '@sveltejs/kit';
import { GET } from '../api/todos/+server';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	try {
		const response = await GET(event);
		const responseBody = await response.json();
		return {
			todos: (responseBody.data || []) as ITodo[],
		};
	} catch (err) {
		handleError(err);
	}
};
