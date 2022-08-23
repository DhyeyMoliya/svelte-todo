import { handleError, successRes } from '$lib/helpers/response';
import { Todo, type ITodo } from '$lib/models/todo';
import type { ServerLoad } from '@sveltejs/kit';

export const load: ServerLoad = async ({}) => {
	try {
		return {
			todos: await Todo.find({}).lean(),
		};
	} catch (err) {
		handleError(err);
	}
};
