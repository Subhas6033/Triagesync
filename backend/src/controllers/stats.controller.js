import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { getAdminDashboardStats } from "../services/stats.service.js";

export const getAdminStats = asyncHandler(async (req, res) => {
  const stats = await getAdminDashboardStats();

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        stats,
        "Admin dashboard statistics fetched successfully",
      ),
    );
});
