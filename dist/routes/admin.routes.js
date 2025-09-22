import { Router } from "express";
import { requireAuth, requireRoles } from "../middleware/auth.js";
import { USER_ROLES, User } from "../models/user.js";
const router = Router();
router.get("/users", requireAuth, requireRoles([USER_ROLES.ADMIN]), async (_req, res) => {
    const users = await User.find().select("firstName lastName email role").limit(100);
    res.json(users);
});
export default router;
