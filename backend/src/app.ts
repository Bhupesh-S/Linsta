// Express app initialization
import express, { Express } from "express";
import cors from "cors";
import healthRoutes from "./routes/health.routes";
import authRoutes from "./modules/auth/auth.routes";
import userRoutes from "./modules/users/user.routes";
import eventRoutes from "./modules/events/event.routes";
import postRoutes from "./modules/posts/post.routes";
import notificationRoutes from "./modules/notifications/notification.routes";
import chatRoutes from "./modules/chat/chat.routes";
import analyticsRoutes from "./modules/analytics/analytics.routes";
import storyRoutes from "./modules/stories/story.routes";
import storyHighlightRoutes from "./modules/stories/storyhighlight.routes";
import feedRoutes from "./modules/feed/feed.routes";
import reportRoutes from "./modules/reports/report.routes";
import closeFriendRoutes from "./modules/closefriends/closefriend.routes";
import postShareRoutes from "./modules/posts/postshare.routes";
import commentExtendedRoutes from "./modules/posts/commentextended.routes";
import groupRoutes from "./modules/groups/group.routes";
import jobRoutes from "./modules/jobs/job.routes";
import { requestLogger } from "./middlewares/requestLogger.middleware";
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler.middleware";
import { rateLimitMiddleware } from "./middlewares/rateLimit.middleware";

const app: Express = express();

// CORS configuration
const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:3000").split(",");
const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"), false);
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// Global Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cors(corsOptions));

// Rate limiting
app.use(rateLimitMiddleware);

// Request logging
app.use(requestLogger);

// Routes
app.use("/", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/users", closeFriendRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/posts", postShareRoutes);
app.use("/api/posts", commentExtendedRoutes);
app.use("/api/feed", feedRoutes);
app.use("/api/stories", storyRoutes);
app.use("/api/stories", storyHighlightRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/reports", reportRoutes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
