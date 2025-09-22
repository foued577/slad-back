import { z } from "zod";
import { User } from "../models/user.js";
import { signAccessToken, signRefreshToken } from "../utils/jwt.js";
const registerSchema = z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(6),
    role: z.string().optional(),
});
const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});
export async function register(req, res) {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ message: "Invalid data", errors: parsed.error.flatten() });
        return;
    }
    const { firstName, lastName, email, password, role } = parsed.data;
    const exists = await User.findOne({ email });
    if (exists) {
        res.status(409).json({ message: "Email already in use" });
        return;
    }
    const user = await User.create({ firstName, lastName, email, passwordHash: password, role });
    const accessToken = signAccessToken({ sub: user.id, role: user.role });
    const refreshToken = signRefreshToken({ sub: user.id, role: user.role });
    res.status(201).json({
        user: { id: user.id, firstName, lastName, email, role: user.role },
        tokens: { accessToken, refreshToken },
    });
}
export async function login(req, res) {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ message: "Invalid data", errors: parsed.error.flatten() });
        return;
    }
    const { email, password } = parsed.data;
    const user = await User.findOne({ email });
    if (!user) {
        res.status(401).json({ message: "Invalid credentials" });
        return;
    }
    const ok = await user.comparePassword(password);
    if (!ok) {
        res.status(401).json({ message: "Invalid credentials" });
        return;
    }
    const accessToken = signAccessToken({ sub: user.id, role: user.role });
    const refreshToken = signRefreshToken({ sub: user.id, role: user.role });
    res.json({
        user: { id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email, role: user.role },
        tokens: { accessToken, refreshToken },
    });
}
export async function refresh(req, res) {
    const token = req.body?.refreshToken ?? req.headers["x-refresh-token"];
    if (!token) {
        res.status(400).json({ message: "Missing refresh token" });
        return;
    }
    try {
        // For simplicity we use same secret and payload
        const { sub, role } = JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());
        // In real-world, verify signature and maybe use separate secret/store
        const accessToken = signAccessToken({ sub, role });
        res.json({ accessToken });
    }
    catch {
        res.status(401).json({ message: "Invalid refresh token" });
    }
}
