import { Schema, model, models } from 'mongoose';

export interface ITask extends DeepPartial<{
    title: string,
    description: string,
    createdAt: Date
    updatedAt: Date
}> { }

const taskSchema = new Schema<ITask>({
    title: String,
    description: String,
}, {
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
});

if (models['Task']) {
    delete models['Task'];
}

export const Task = model<ITask>('Task', taskSchema);

Task.syncIndexes().catch((err) => { });