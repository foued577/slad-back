import { Router } from "express";
import { requireAuth, requireRoles } from "../middleware/auth.js";
import { User } from "../models/user.js";
import { USER_ROLES } from "../models/user.js";
const router = Router();
router.get("/me", requireAuth, async (req, res) => {
    const userId = req.user?.id;
    if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    const user = await User.findById(userId).select("firstName lastName email role");
    if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
    }
    res.json(user);
});
export default router;
// Update current user profile
router.patch("/me", requireAuth, async (req, res) => {
    const userId = req.user?.id;
    if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    const { firstName, lastName, phone, promotion, organization, password } = req.body ?? {};
    const user = await User.findById(userId);
    if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
    }
    if (firstName !== undefined)
        user.firstName = String(firstName);
    if (lastName !== undefined)
        user.lastName = String(lastName);
    if (phone !== undefined)
        user.phone = String(phone);
    if (promotion !== undefined)
        user.promotion = String(promotion);
    if (organization !== undefined)
        user.organization = String(organization);
    if (password)
        user.passwordHash = String(password);
    await user.save();
    res.json({ id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email, role: user.role });
});
// Admin: get a user by id
router.get("/:id", requireAuth, requireRoles([USER_ROLES.ADMIN]), async (req, res) => {
    const user = await User.findById(req.params.id).select("firstName lastName email role");
    if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
    }
    res.json(user);
});
