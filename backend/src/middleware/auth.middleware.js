import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { verifyToken } from "../utils/jwt.js";
import { findUserById } from "../repositories/mysql/user.repository.js";

export const authenticate = asyncHandler(async (req, res, next) => {
  const authorization = req.headers.authorization;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    throw new ApiError(
      401,
      "Authentication token is required",
      "UNAUTHENTICATED",
    );
  }

  const token = authorization.split(" ")[1];

  if (!token) {
    throw new ApiError(
      401,
      "Authentication token is required",
      "UNAUTHENTICATED",
    );
  }

  let decoded;

  try {
    decoded = verifyToken(token);
  } catch {
    throw new ApiError(
      401,
      "Invalid or expired authentication token",
      "UNAUTHENTICATED",
    );
  }

  const user = await findUserById(decoded.userId);

  if (!user) {
    throw new ApiError(401, "User account not found", "UNAUTHENTICATED");
  }

  req.user = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  next();
});
