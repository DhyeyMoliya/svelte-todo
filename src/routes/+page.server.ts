import { handleError, successRes } from '$lib/helpers/response';
import { Task, type ITask } from '$lib/models/task';
import type { ServerLoad } from '@sveltejs/kit';
import type { HydratedDocument, LeanDocumentOrArray } from 'mongoose';

export const load: ServerLoad = async ({}) => {
	try {
		return {
			todos: await Task.find({}).lean(),
		};
	} catch (err) {
		handleError(err);
	}
};
