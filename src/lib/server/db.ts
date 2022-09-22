import mongoose from 'mongoose';
var db = null;

export const connectMongoDB = async () => {
	try {
		const { APP_MONGO_URI } = process.env;
		if (!db) {
			db = await mongoose.connect(APP_MONGO_URI);
			console.log('Connected to MongoDB');
		}
	} catch (error) {
		console.error(error);
	}
};
