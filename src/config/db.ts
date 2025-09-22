import mongoose from "mongoose";

export async function connectToDatabase(mongoUri: string): Promise<void> {
  if (!mongoUri) throw new Error("Missing mongoUri");
  await mongoose.connect(mongoUri);
}


