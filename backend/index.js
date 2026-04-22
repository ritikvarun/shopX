import express from "express";
import dotenv from "dotenv";
import connectDb from "./config/db.js";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
dotenv.config();
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import returnRoutes from "./routes/returnRoutes.js";
import settingRouter from "./routes/settingRoute.js";
import reviewRouter from "./routes/reviewRoute.js";

let port = process.env.PORT || 6000;

let app = express();

const localOrigins = ["https://shopx-6u3e.onrender.com", "https://shopx-admin-ktdc.onrender.com"];
const productionOrigins = [
  process.env.FRONTEND_URL,
  process.env.ADMIN_URL,
  process.env.FRONTEND_URL_2,
  process.env.ADMIN_URL_2,
  "https://shop-x-lac.vercel.app",
  "https://shop-x-teal.vercel.app",
].filter(Boolean);
const normalizeOrigin = (value) => value.replace(/\/$/, "").toLowerCase();
const allowedOrigins =
  process.env.NODE_ENV === "production"
    ? productionOrigins.map(normalizeOrigin)
    : [...localOrigins, ...productionOrigins].map(normalizeOrigin);

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser requests (no Origin header) and configured clients.
      if (!origin || allowedOrigins.includes(normalizeOrigin(origin))) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/product", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/return", returnRoutes);
app.use("/api/setting", settingRouter);
app.use("/api/review", reviewRouter);

app.listen(port, () => {
  console.log("Hello From Server");
  connectDb();
});
