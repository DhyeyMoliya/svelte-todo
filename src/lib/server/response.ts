import { error } from '@sveltejs/kit';

export const successRes = (body: any = {}, status = 200, headers = {}, stringified = true) => {
	let resBody: any = { data: body, status: 'SUCCESS' };

	if (stringified) {
		resBody = JSON.stringify(resBody);
	}

	const headersObj = new Headers(headers);
	if (stringified) {
		headersObj.append('content-type', 'application/json');
	}

	return new Response(resBody, {
		status: status,
		headers: headersObj,
	});
};

export const handleError = (err) => {
	console.error(err);
	if (err?.status || err?.location) {
		throw err;
	}
	throw error(500);
};
