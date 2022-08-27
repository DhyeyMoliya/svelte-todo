import { base } from '$app/paths';
import { UserSession } from '$lib/models/user-session';
import type { PageServerLoad } from './$types';
import cookie from 'cookie';
import { handleError } from '$lib/helpers/response';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals, parent, setHeaders }) => {
	try {
		await parent();
		if (locals.sessionId) {
			await UserSession.findByIdAndRemove(locals.sessionId);
		}
		locals.sessionId = null;
		locals.user = null;

		throw redirect(307, `${base}/`);
	} catch (err) {
		handleError(err);
	}
};
