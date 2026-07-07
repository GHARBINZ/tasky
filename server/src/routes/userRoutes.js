import { Router } from "express";
import { updateProfile, updateSecurity } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";
import { uploadAvatar } from "../config/multer.js";

const router = Router();

// protect → verify JWT, then uploadAvatar → parse the multipart form
router.put("/profile", protect, uploadAvatar, updateProfile);
router.put("/update-security", protect, updateSecurity);

export default router;
