import { base } from '$app/paths';
import { postData, putData } from '$lib/helpers/api';
import { ErrorToast, SuccessToast } from '$lib/helpers/toasts';

export const createTodo = async (data: any) => {
	try {
		const res = await postData({
			url: `${base}/api/todos`,
			body: data,
		});

		if (res?.status === 'SUCCESS') {
			SuccessToast.show('To Do Created Successfully!');
			return res;
		}
		throw new Error();
	} catch (error) {
		ErrorToast.show('Something went wrong. Try again.');
		return null;
	}
};

export const updateTodoStatus = async (todoId: string, completed: boolean) => {
	try {
		const res = await putData({
			url: `${base}/api/todos/${todoId}/status`,
			body: { completed },
		});

		if (res?.status === 'SUCCESS') {
			return res;
		}
		throw new Error();
	} catch (error) {
		ErrorToast.show('Something went wrong. Try again.');
		return null;
	}
};

export const updateTodo = async (todoId: string, data: { title: string; description: string }) => {
	try {
		const res = await putData({
			url: `${base}/api/todos/${todoId}`,
			body: data,
		});

		if (res?.status === 'SUCCESS') {
			return res;
		}
		throw new Error();
	} catch (error) {
		ErrorToast.show('Something went wrong. Try again.');
		return null;
	}
};
