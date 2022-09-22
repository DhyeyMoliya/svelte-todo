<script lang="ts">
	import { goto, invalidate } from '$app/navigation';
	import { page } from '$app/stores';
	import { DateTime } from 'luxon';
	import type { PageData } from './$types';
	import { createForm } from 'svelte-form-validation';
	import * as yup from 'yup';
	import { createTodo, updateTodo, updateTodoStatus } from '$lib/services/todos';
	import type { ITodo } from '$lib/models/todo';
	import { tick } from 'svelte';

	export let data: PageData;
	$: ({ todos = [] } = data);

	let adding = false;
	let showAll = $page.url.searchParams.get('filter') === 'all';
	let editingTodo: string = null;

	let { values, highlight, isValid, resetForm } = createForm({
		values: {
			title: '',
			description: '',
		},
		validationSchema: yup.object().shape({
			title: yup.string().trim().required(),
			description: yup.string(),
		}),
	});

	let {
		values: editValues,
		highlight: editHighlight,
		isValid: editIsValid,
		validateForm: editValidateForm,
		resetForm: editResetForm,
	} = createForm({
		values: {
			title: '',
			description: '',
		},
		validationSchema: yup.object().shape({
			title: yup.string().trim().required(),
			description: yup.string(),
		}),
	});

	const onRefreshTodos = () => {
		invalidate('page:data').then(() => {
			editingTodo = null;
		});
	};

	const onFilterTodos = async (event: Event) => {
		showAll = (event.target as HTMLInputElement).checked;
		const url = new URL($page.url);
		if (showAll) {
			url.searchParams.set('filter', 'all');
		} else {
			url.searchParams.delete('filter');
		}
		await goto(url);
	};

	const onCreateTodo = async () => {
		await createTodo($values);
		adding = false;
		resetForm({
			title: '',
			description: '',
		});
		onRefreshTodos();
	};

	const onAdd = () => {
		adding = true;
	};

	const onCancelAdding = () => {
		adding = false;
		resetForm({
			title: '',
			description: '',
		});
	};

	const onUpdateTodoStatus = async (todoId: string, completed: boolean) => {
		await updateTodoStatus(todoId, completed);
		onRefreshTodos();
	};

	const onClickTodo = async (todo: ITodo, todoIndex: number) => {
		editingTodo = todo._id;
		editResetForm({
			title: todo.title,
			description: todo.description,
		});
		editValidateForm();
		await tick();
		document.getElementById(`edit-todo-title-${todo._id}`)?.focus();
	};

	const onKeyDownEditDescription = async (event: KeyboardEvent) => {
		if ($editIsValid && event.code === 'Enter' && (event.metaKey || event.ctrlKey)) {
			onUpdateTodo();
		}
	};

	const onUpdateTodo = async () => {
		const res = await updateTodo(editingTodo, $editValues);
		if (res) {
			onRefreshTodos();
		}
	};

	const onCancelUpdateTodo = () => {
		editingTodo = null;
		editResetForm({
			title: '',
			description: '',
		});
		editValidateForm();
	};

	const onPageKeyUpEvent = (event: KeyboardEvent) => {
		if (editingTodo && event.code === 'Escape') {
			onCancelUpdateTodo();
		}
	};
</script>

<svelte:window on:keyup={onPageKeyUpEvent} />

<section class="row gx-3 justify-content-center mb-3">
	<div class="col-8">
		<div class="row align-items-center justify-content-end">
			<div class="col-auto">
				<div class="form-check form-switch">
					<input class="form-check-input" type="checkbox" role="switch" id="filterMode" aria-checked={showAll} bind:checked={showAll} on:change={onFilterTodos} />
					<label class="form-check-label" for="filterMode">Show Completed</label>
				</div>
			</div>
			{#if !adding}
				<div class="col-auto">
					<button class="btn btn-outline-primary" type="button" on:click={onAdd}>New To Do</button>
				</div>
			{/if}
		</div>
	</div>
</section>
{#if adding}
	<section class="row justify-content-center mb-3">
		<div class="col-8">
			<form class="border shadow-sm shadow-primary rounded p-3 bg-light" on:submit|preventDefault|stopPropagation={$isValid && onCreateTodo}>
				<h3>Create New To Do</h3>
				<div class="mb-3">
					<label for="new-todo-title" class="form-label">To Do*</label>
					<input type="text" class="form-control" id="new-todo-title" name="title" bind:value={$values.title} use:highlight />
				</div>
				<div class="mb-3">
					<label for="new-todo-description" class="form-label">Description</label>
					<textarea rows="4" class="form-control" id="new-todo-description" name="description" bind:value={$values.description} use:highlight />
				</div>
				<div class="text-center">
					<button class="btn btn-primary" type="submit" disabled={!$isValid}>Create To Do</button>
					<button class="btn btn-outline-secondary" type="button" on:click={onCancelAdding}>Cancel</button>
				</div>
			</form>
		</div>
	</section>
{/if}
<section class="row justify-content-center mb-3">
	<div class="col-8">
		{#if todos?.length}
			{#each todos as todo, todoIndex (todo._id)}
				<div
					class="card shadow shadow-sm mb-3 {todo.completed ? 'mb-3 bg-light border-0 shadow-none' : ''}"
					class:bg-primary={editingTodo === todo._id}
					style:--bs-bg-opacity={editingTodo === todo._id ? '0.1' : '1'}>
					<div class="card-body">
						<div class="row">
							{#if editingTodo !== todo._id}
								<div class="col" style:cursor="pointer" on:click={() => onClickTodo(todo, todoIndex)}>
									<h4 class="card-title" class:text-decoration-line-through={todo.completed}>{todo.title}</h4>
									<div class="card-text text-muted mb-2" class:text-decoration-line-through={todo.completed}>
										<div>
											{@html todo.description.replace(/\n/g, '</div><div>')}
										</div>
									</div>
									<div class="card-text text-muted timestamp">
										{DateTime.fromISO(todo.createdAt.toString()).toFormat('dd MMM, yyyy hh:mm a')}
									</div>
								</div>
								<div class="col-auto">
									{#if !todo.completed}
										<button class="btn btn-sm btn-outline-success" on:click={() => onUpdateTodoStatus(todo._id, true)}> Mark Complete </button>
									{:else}
										<button class="btn btn-sm btn-outline-secondary" on:click={() => onUpdateTodoStatus(todo._id, false)}> Mark Active </button>
									{/if}
								</div>
							{:else}
								<form
									on:submit|preventDefault|stopPropagation={() => {
										$editIsValid && onUpdateTodo();
									}}>
									<div class="mb-3">
										<label for="edit-todo-title-{todo._id}" class="form-label">To Do*</label>
										<input type="text" class="form-control" id="edit-todo-title-{todo._id}" name="title" bind:value={$editValues.title} use:editHighlight />
									</div>
									<div class="mb-1">
										<label for="edit-todo-description-{todo._id}" class="form-label">Description</label>
										<textarea
											rows="4"
											class="form-control"
											id="edit-todo-description-{todo._id}"
											name="description"
											bind:value={$editValues.description}
											use:editHighlight
											on:keydown={onKeyDownEditDescription} />
									</div>
									<span class="text-muted"><small><code>Ctrl + Enter</code> to Save or <code>Escape</code> to Cancel</small></span>
								</form>
							{/if}
						</div>
					</div>
				</div>
			{/each}
		{:else}
			<div class="card bg-light border-0 shadow-none">
				<div class="card-body text-center">
					<div class="h1">Hurray!</div>
					<div class="h3 fw-light">Have a cup of tea.</div>
				</div>
			</div>
		{/if}
	</div>
</section>

<style>
	.timestamp {
		font-size: 0.75rem;
	}
</style>
