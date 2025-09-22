import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from "bcrypt";

export const USER_ROLES = {
  APPRENANT: "apprenant",
  FORMATEUR: "formateur",
  MAITRE_APPRENTISSAGE: "maitre_apprentissage",
  ADMIN: "admin",
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

export interface UserDocument extends Document {
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  phone?: string;
  promotion?: string;
  organization?: string; // CFA or company name
  isActive: boolean;
  comparePassword(candidate: string): Promise<boolean>;
}

export interface UserModel extends Model<UserDocument> {}

const UserSchema = new Schema<UserDocument, UserModel>(
  {
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
  },
  { timestamps: true }
);

UserSchema.methods.comparePassword = async function (this: UserDocument, candidate: string): Promise<boolean> {
  return bcrypt.compare(candidate, this.passwordHash);
};

// Utility to set password on create/update
UserSchema.pre("save", async function (next) {
  const doc = this as UserDocument;
  if (!doc.isModified("passwordHash")) return next();
  const saltRounds = 10;
  doc.passwordHash = await bcrypt.hash(doc.passwordHash, saltRounds);
  next();
});

export const User = (mongoose.models.User as UserModel) || mongoose.model<UserDocument, UserModel>("User", UserSchema);


