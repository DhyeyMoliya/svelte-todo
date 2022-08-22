import { Schema, model, models } from 'mongoose';

export interface ITask
	extends DeepPartial<{
		title: string;
		description: string;
		dueDate: Date;
		completed: boolean;
		completedAt: Date;
		createdAt: Date;
		updatedAt: Date;
	}> {}

const taskSchema = new Schema<ITask>(
	{
		title: String,
		description: String,
		dueDate: Date,
		completed: { type: Boolean, default: false },
		completedAt: Date
	},
	{
		timestamps: true,
		toJSON: {
			virtuals: true
		},
		toObject: {
			virtuals: true
		},
		collation: {
			locale: 'en_US',
			numericOrdering: true
		}
	}
);

if (models['Task']) {
	delete models['Task'];
}

export const Task = model<ITask>('Task', taskSchema);

Task.syncIndexes().catch((err) => {});
