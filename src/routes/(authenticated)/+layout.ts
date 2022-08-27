import { browser } from '$app/env';
import { goto } from '$app/navigation';
import { base } from '$app/paths';
import { redirect } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ parent }) => {
	const data = await parent();
	if (!data.session?.sessionId) {
		if (browser) {
			goto(`${base}/login`);
		} else {
			throw redirect(307, `${base}/login`);
		}
	}
	return data;
};
