import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

import {
  registerUser,
  loginUser,
  getCurrentUser,
} from "../services/auth.service.js";

export const register = asyncHandler(async (req, res) => {
  const result = await registerUser(req.body);

  res.status(201).json(new ApiResponse(201, result, "Registration successful"));
});

export const login = asyncHandler(async (req, res) => {
  const result = await loginUser(req.body);

  res.status(200).json(new ApiResponse(200, result, "Login successful"));
});

export const me = asyncHandler(async (req, res) => {
  const user = await getCurrentUser(req.user.id);

  res
    .status(200)
    .json(new ApiResponse(200, { user }, "User retrieved successfully"));
});
