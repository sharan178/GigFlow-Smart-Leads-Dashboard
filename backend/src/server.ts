import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDatabase } from "./config/database";
import authRoutes from "./routes/auth.routes";
import leadRoutes from "./routes/lead.routes";
import { errorHandler, notFoundHandler } from "./middleware/error.middleware";

dotenv.config();

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json());

app.get("/health", (_req, res) => {
  res.status(200).json({ success: true, message: "API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/leads", leadRoutes);
app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

connectDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Database connection failed", error);
    process.exit(1);
  });
