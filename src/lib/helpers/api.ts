type APIInput = {
	url?: string;
	query?: any;
};

type GetInput = APIInput;
type PostInput = APIInput & {
	multipart?: boolean;
	body?: any;
};
type PutInput = PostInput;
type DeleteInput = APIInput & {
	body?: any;
};

const ContentTypes = {
	json: 'application/json',
	text: 'text/html',
	multipart: 'multipart/form-data',
};

const CommonHeaders = {
	'cache-control': 'no-cache',
	pragma: 'no-cache',
	accept: 'application/json',
};

const RenewHeader = 'RENEW-USER';

// export const renewUser = async () => {
// 	try {
// 		const res = await getData({ url: `${API_URL}/auth/renew` });
// 		if (res.data?._id) {
// 			if (browser) {
// 				localStorage.setItem(localKeys.user, JSON.stringify(res.data));
// 			}
// 			user.set(res.data);
// 			return true;
// 		} else {
// 			return false;
// 		}
// 	} catch (error) {
// 		return false;
// 	}
// };

const handleRes = async (res: Response, resolve: (value?: unknown) => void, reject: (reason?: any) => void) => {
	if (res.headers.get(RenewHeader) === 'YES') {
		// renewUser();
		console.log('renew headers');
	}
	if (res.ok) {
		if (res.headers.get('content-type')!.indexOf(ContentTypes.json) >= 0) {
			resolve(await res.json());
		} else {
			resolve(await res.text());
		}
	} else {
		if (res.headers.get('content-type')!.indexOf(ContentTypes.json) >= 0) {
			const error = await res.json();
			console.error('API ERROR 1 : ', error);
			reject({ status: res.status, headers: res.headers, body: error });
		} else {
			const error = await res.text();
			console.error('API ERROR 2 : ', error);
			reject({ status: res.status, headers: res.headers, body: error });
		}
	}
};

export const getData = ({ url, query = {} }: GetInput): Promise<any> => {
	return new Promise(async (resolve, reject) => {
		const queryString = new URLSearchParams(query).toString();
		try {
			const res = await fetch(url + (queryString ? `?${queryString}` : ''), {
				method: 'GET',
				headers: {
					'content-type': ContentTypes.json,
					...CommonHeaders,
				},
			});
			handleRes(res, resolve, reject);
		} catch (error) {
			console.error('API ERROR : ', error);
			reject(error);
		}
	});
};

export const postData = ({ url, body = {}, query = {}, multipart = false }: PostInput): Promise<any> => {
	return new Promise(async (resolve, reject) => {
		const queryString = new URLSearchParams(query).toString();
		try {
			const res = await fetch(url + (queryString ? `?${queryString}` : ''), {
				method: 'POST',
				headers: {
					...(multipart ? {} : { 'content-type': ContentTypes.json }),
					...CommonHeaders,
				},
				body: multipart ? body : JSON.stringify(body),
			});
			handleRes(res, resolve, reject);
		} catch (error) {
			console.error('API ERROR : ', error);
			reject(error);
		}
	});
};

export const putData = ({ url, body = {}, query = {}, multipart = false }: PutInput): Promise<any> => {
	return new Promise(async (resolve, reject) => {
		const queryString = new URLSearchParams(query).toString();
		try {
			const res = await fetch(url + (queryString ? `?${queryString}` : ''), {
				method: 'PUT',
				headers: {
					...(multipart ? {} : { 'content-type': ContentTypes.json }),
					...CommonHeaders,
				},
				body: multipart ? body : JSON.stringify(body),
			});
			handleRes(res, resolve, reject);
		} catch (error) {
			console.error('API ERROR : ', error);
			reject(error);
		}
	});
};

export const deleteData = ({ url, query = {}, body }: DeleteInput): Promise<any> => {
	return new Promise(async (resolve, reject) => {
		const queryString = new URLSearchParams(query).toString();
		try {
			const res = await fetch(url + (queryString ? `?${queryString}` : ''), {
				method: 'DELETE',
				headers: {
					'content-type': ContentTypes.json,
					...CommonHeaders,
				},
				...(body ? { body: JSON.stringify(body) } : {}),
			});
			handleRes(res, resolve, reject);
		} catch (error) {
			console.error('API ERROR : ', error);
			reject(error);
		}
	});
};
