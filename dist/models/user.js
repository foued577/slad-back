import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
export const USER_ROLES = {
    APPRENANT: "apprenant",
    FORMATEUR: "formateur",
    MAITRE_APPRENTISSAGE: "maitre_apprentissage",
    ADMIN: "admin",
};
const UserSchema = new Schema({
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    passwordHash: { type: String, required: true },
    role: {
        type: String,
        required: true,
        enum: Object.values(USER_ROLES),
        default: USER_ROLES.APPRENANT,
    },
    phone: { type: String },
    promotion: { type: String },
    organization: { type: String },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });
UserSchema.methods.comparePassword = async function (candidate) {
    return bcrypt.compare(candidate, this.passwordHash);
};
// Utility to set password on create/update
UserSchema.pre("save", async function (next) {
    const doc = this;
    if (!doc.isModified("passwordHash"))
        return next();
    const saltRounds = 10;
    doc.passwordHash = await bcrypt.hash(doc.passwordHash, saltRounds);
    next();
});
export const User = mongoose.models.User || mongoose.model("User", UserSchema);
