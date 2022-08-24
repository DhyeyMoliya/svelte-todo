import { handleError, successRes } from '$lib/helpers/response';
import { Todo } from '$lib/models/todo';
import { error, type RequestHandler } from '@sveltejs/kit';

export const PUT: RequestHandler = async ({ request, params }) => {
	try {
		const body: { completed: boolean } = await request.json();
		const todo = await Todo.findById(params.id);

		if (!todo) {
			throw error(404);
		}

		todo.completed = body.completed;
		todo.completedAt = new Date();
		await todo.save();
		return successRes(todo);
	} catch (err) {
		handleError(err);
	}
};
