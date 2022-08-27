import { browser } from '$app/env';
import { goto } from '$app/navigation';
import { base } from '$app/paths';
import { redirect } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';
import cookie from 'cookie';

export const load: LayoutLoad = async ({ parent, setHeaders, url }) => {
	const data = await parent();
	if (data.session?.sessionId) {
		if (browser) {
			goto(`${base}/`);
		} else {
			throw redirect(307, `${base}/`);
		}
	}
	return data;
};
