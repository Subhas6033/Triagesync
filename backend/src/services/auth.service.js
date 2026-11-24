import bcrypt from "bcrypt";

import ApiError from "../utils/ApiError.js";
import {
  createUser,
  findUserByEmail,
  findUserById,
} from "../repositories/mysql/user.repository.js";

import { generateToken } from "../utils/jwt.js";

const SALT_ROUNDS = 12;

const sanitizeUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  createdAt: user.createdAt,
});

export const registerUser = async ({ name, email, password }) => {
  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    throw new ApiError(
      409,
      "An account with this email already exists",
      "CONFLICT",
    );
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  let user;

  try {
    user = await createUser({
      name,
      email,
      passwordHash: hashedPassword,
      role: "USER",
    });
  } catch (error) {
    // Handles duplicate registration requests arriving simultaneously.
    if (error.code === "P2002") {
      throw new ApiError(
        409,
        "An account with this email already exists",
        "CONFLICT",
      );
    }

    throw error;
  }

  return {
    user: sanitizeUser(user),
  };
};

export const loginUser = async ({ email, password }) => {
  const user = await findUserByEmail(email);

  if (!user) {
    throw new ApiError(401, "Invalid email or password", "UNAUTHENTICATED");
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHash);

  if (!passwordMatches) {
    throw new ApiError(401, "Invalid email or password", "UNAUTHENTICATED");
  }

  const token = generateToken(user);

  return {
    user: sanitizeUser(user),
    token,
  };
};

export const getCurrentUser = async (userId) => {
  const user = await findUserById(userId);

  if (!user) {
    throw new ApiError(401, "User account no longer exists", "UNAUTHENTICATED");
  }

  return sanitizeUser(user);
};
