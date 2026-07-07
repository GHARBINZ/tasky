import jwt from "jsonwebtoken";
import User from "../models/User.js";

// PUT /api/user/profile
export const updateProfile = async (req, res, next) => {
  try {
    const updates = {};

    // Name update (optional)
    if (req.body.name !== undefined) {
      const trimmed = req.body.name.trim();
      if (!trimmed) {
        return res.status(400).json({ message: "Name cannot be empty" });
      }
      updates.name = trimmed;
    }

    // Avatar update (only if a file came through multer)
    if (req.file) {
      updates.avatar = `/uploads/avatars/${req.file.filename}`;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: "Nothing to update" });
    }

    const user = await User.findByIdAndUpdate(req.user.id, updates, {
      returnDocument: "after",
      runValidators: true,
      omitUndefined: true,
    });

    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const updateSecurity = async (req, res, next) => {
  try {
    const { currentPassword, newEmail, newPassword } = req.body;

    if (!currentPassword) {
      return res.status(400).json({ message: "Current password is required" });
    }

    if (!newEmail && !newPassword) {
      return res.status(400).json({ message: "Nothing to update" });
    }

    const user = await User.findById(req.user.id).select("+password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const valid = await user.comparePassword(currentPassword);
    if (!valid) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    if (newEmail && newEmail.toLowerCase().trim() !== user.email) {
      const normalized = newEmail.toLowerCase().trim();
      const existing = await User.findOne({ email: normalized });
      if (existing && existing._id.toString() !== user._id.toString()) {
        return res.status(409).json({ message: "That email is already in use" });
      }
      user.email = normalized;
    }

    if (newPassword) {
      if (newPassword.length < 8) {
        return res.status(400).json({ message: "New password must be at least 8 characters" });
      }
      user.password = newPassword;
    }

    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    });

    res.status(200).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, avatar: user.avatar },
    });
  } catch (err) {
    next(err);
  }
};
