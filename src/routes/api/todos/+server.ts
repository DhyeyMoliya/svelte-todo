import { handleError, successRes } from '$lib/helpers/response';
import { Todo } from '$lib/models/todo';
import { error, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const body: { title: string; description: string } = await request.json();
		if (!body.title) {
			throw error(400);
		}

		const newTodo = new Todo({
			title: body.title,
			description: body.description || '',
		});

		await newTodo.save();

		return successRes(newTodo.toJSON());
	} catch (err) {
		handleError(err);
	}
};
