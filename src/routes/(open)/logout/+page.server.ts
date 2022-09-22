import { UserSession } from '$lib/models/user-session';
import type { PageServerLoad } from './$types';
import { handleError } from '$lib/server/response';
import { redirect } from '@sveltejs/kit';
import { base } from '$app/paths';

export const load: PageServerLoad = async ({ locals, cookies }) => {
	try {
		if (locals.sessionId) {
			await UserSession.findByIdAndRemove(locals.sessionId);
		}
		locals.sessionId = null;
		locals.user = null;

		cookies.delete('session');
	} catch (err) {
		handleError(err);
	}
};
