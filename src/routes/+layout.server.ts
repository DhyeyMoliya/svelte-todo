import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ request, locals }) => {
	return {
		session: {
			sessionId: locals.sessionId,
			user: locals.user,
		},
	};
};
