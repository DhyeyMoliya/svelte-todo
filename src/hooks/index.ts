import type { Handle } from "@sveltejs/kit";
import { connectMongoDB } from "$lib/helpers/database/mongodb";
import { initModels } from "$lib/models";

connectMongoDB().then(() => {
    initModels();
});

export const handle: Handle = ({ event, resolve }) => {
    const response = resolve(event);
    return response;
}