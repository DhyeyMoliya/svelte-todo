import { handleError, successRes } from '$lib/server/response';
import { Todo } from '$lib/models/todo';
import { error, type RequestHandler } from '@sveltejs/kit';

export const PUT: RequestHandler = async ({ request, params, locals }) => {
	try {
		const body: { completed: boolean } = await request.json();
		const todo = await Todo.findById(params.id);

		if (!todo || todo.user.toString() !== locals.user._id) {
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
