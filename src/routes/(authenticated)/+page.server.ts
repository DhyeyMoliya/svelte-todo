import { toJSON } from '$lib/helpers/object';
import { handleError, successRes } from '$lib/helpers/response';
import { Todo, type ITodo } from '$lib/models/todo';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, locals }) => {
	try {
		const filter = url.searchParams.get('filter');
		const query: any = {
			completed: false,
		};
		if (filter === 'all') {
			delete query.completed;
		}
		const todos = (await Todo.find(query).sort({ createdAt: -1 })).map((todo) => todo.toJSON() as ITodo);
		return {
			todos: toJSON(todos),
		};
	} catch (err) {
		handleError(err);
	}
};
