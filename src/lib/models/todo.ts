import mongoose from 'mongoose';
import type { Document, Model } from 'mongoose';
import type { IUser } from './user';

const { Schema, model, models } = mongoose;

export interface ITodo
	extends Partial<Document>,
		DeepPartial<{
			user: string | IUser;
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
		user: {
			type: Schema.Types.ObjectId,
			ref: 'User',
		},
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
