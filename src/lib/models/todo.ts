import { Schema, model, models } from 'mongoose';

export interface ITodo
	extends DeepPartial<{
		title: string;
		description: string;
		dueDate: Date;
		completed: boolean;
		completedAt: Date;
		createdAt: Date;
		updatedAt: Date;
	}> {}

const todoSchema = new Schema<ITodo>(
	{
		title: String,
		description: String,
		dueDate: Date,
		completed: { type: Boolean, default: false },
		completedAt: Date,
	},
	{
		timestamps: true,
		toJSON: {
			virtuals: true,
		},
		toObject: {
			virtuals: true,
		},
		collation: {
			locale: 'en_US',
			numericOrdering: true,
		},
	},
);

if (models['Todo']) {
	delete models['Todo'];
}

export const Todo = model<ITodo>('Todo', todoSchema);

Todo.syncIndexes().catch((err) => {});
