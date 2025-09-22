import mongoose from "mongoose";
export async function connectToDatabase(mongoUri) {
    if (!mongoUri)
        throw new Error("Missing mongoUri");
    await mongoose.connect(mongoUri);
}
