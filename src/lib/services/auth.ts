import { base } from '$app/paths';
import { postData, putData } from '$lib/helpers/client/api';
import { ErrorToast, SuccessToast } from '$lib/helpers/client/toasts';

export const login = async (data: any) => {
	try {
		const res = await postData({
			url: `${base}/api/auth/login`,
			body: data,
		});

		if (res?.status === 'SUCCESS') {
			SuccessToast.show('Logged in Successfully!');
			return res;
		}
		throw new Error();
	} catch (error) {
		ErrorToast.show('Something went wrong. Try again.');
		return null;
	}
};
