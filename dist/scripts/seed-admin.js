import dotenv from "dotenv";
dotenv.config();
import { connectToDatabase } from "../config/db.js";
import { loadEnvironment } from "../config/env.js";
import { User, USER_ROLES } from "../models/user.js";
async function main() {
    const env = loadEnvironment();
    await connectToDatabase(env.mongoUri);
    const email = process.env.SEED_ADMIN_EMAIL || "admin@slad.local";
    const password = process.env.SEED_ADMIN_PASSWORD || "Admin#12345";
    const exists = await User.findOne({ email });
    if (exists) {
        // eslint-disable-next-line no-console
        console.log("Admin already exists:", email);
        process.exit(0);
    }
    const admin = await User.create({
        firstName: "Admin",
        lastName: "SLAD",
        email,
        passwordHash: password,
        role: USER_ROLES.ADMIN,
    });
    // eslint-disable-next-line no-console
    console.log("Admin created:", admin.email);
    process.exit(0);
}
main().catch((err) => {
    // eslint-disable-next-line no-console
    console.error(err);
    process.exit(1);
});
