import jwt from "jsonwebtoken";
import { User } from "../models/User";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";

const createToken = (id: string, role: string): string =>
  jwt.sign({ id, role }, process.env.JWT_SECRET || "dev-secret", { expiresIn: "7d" });

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;
  const exists = await User.exists({ email });
  if (exists) throw new ApiError(409, "Email is already registered");

  const user = await User.create({ name, email, password, role });
  res.status(201).json({
    success: true,
    data: { token: createToken(user.id, user.role), user: { id: user.id, name: user.name, email: user.email, role: user.role } },
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.comparePassword(password))) throw new ApiError(401, "Invalid credentials");

  res.status(200).json({
    success: true,
    data: { token: createToken(user.id, user.role), user: { id: user.id, name: user.name, email: user.email, role: user.role } },
  });
});

export const me = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user?.id).select("-password");
  if (!user) throw new ApiError(404, "User not found");
  res.status(200).json({ success: true, data: user });
});
