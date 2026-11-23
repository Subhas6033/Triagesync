import app from "./app.js";
import { env } from "./config/environment.js";
import { prisma } from "./config/mysql.js";
import { connectMongoDB } from "./config/mongodb.js";

const startServer = async () => {
  try {
    await prisma.$connect();
    console.log("MySQL connected successfully");

    await connectMongoDB();

    app.listen(env.PORT, () => {
      console.log(`TriageSync API running on port ${env.PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error);
    await prisma.$disconnect();
    process.exit(1);
  }
};

startServer();
