import { toJSON } from '$lib/helpers/common/object';
import { handleError, successRes } from '$lib/helpers/server/response';
import { Todo, type ITodo } from '$lib/models/todo';
import { error, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ request, locals, url }) => {
	try {
		if (!locals.user) {
			throw error(401);
		}
		const filter = url.searchParams.get('filter');
		const query: any = {
			completed: false,
			user: locals.user._id,
		};
		if (filter === 'all') {
			delete query.completed;
		}
		const todos = (await Todo.find(query).sort({ createdAt: -1 })).map((todo) => todo.toJSON() as ITodo);
		return successRes(toJSON(todos));
	} catch (err) {
		handleError(err);
	}
};

export const POST: RequestHandler = async ({ request, locals }) => {
	try {
		const body: { title: string; description: string } = await request.json();
		if (!body.title) {
			throw error(400);
		}

		const newTodo = new Todo({
			title: body.title,
			description: body.description || '',
			user: locals.user._id,
		});

		await newTodo.save();

		return successRes(newTodo.toJSON());
	} catch (err) {
		handleError(err);
	}
};
