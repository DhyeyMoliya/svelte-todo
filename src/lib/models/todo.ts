import { Schema, model, models, type Document, type Model } from 'mongoose';

export interface ITodo
	extends Partial<Document>,
		DeepPartial<{
			title: string;
			description: string;
			dueDate: Date;
			completed: boolean;
			completedAt: Date;
			createdAt: Date;
			updatedAt: Date;
		}> {}

interface ITodoModel extends Model<ITodo> {}

const todoSchema = new Schema<ITodo, ITodoModel>(
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

export const Todo = model<ITodo, ITodoModel>('Todo', todoSchema);

Todo.syncIndexes().catch((err) => {});
