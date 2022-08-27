import { session } from '$lib/helpers/client/client-session';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ data }) => {
	session.set(data.session);
	return data;
};
