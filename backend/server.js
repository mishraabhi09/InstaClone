
import express from "express";
import dotenv from "dotenv";
dotenv.config();

import cors from "cors";
import "express-async-errors";

import connectDB from "./db/connection.js";

// routes
import authRoute from "./routes/authRoute.js";
import userRoute from "./routes/userRoute.js";
import feedRoute from "./routes/feedRoute.js";

// middleware
import notFoundMiddleware from "./middleware/not-found.js";
import errorHandlerMiddleware from "./middleware/error-handler.js";
import authenticateUser from "./middleware/auth.js";

import helmet from "helmet";
import xss from "xss-clean";
import mongoSanitize from "express-mongo-sanitize";

const app = express();

// ✅ CORS
app.use(cors());

// security
app.use(helmet());
app.use(xss());
app.use(mongoSanitize());

// body parser
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));

// routes
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/user", authenticateUser, userRoute);
app.use("/api/v1/feed", authenticateUser, feedRoute);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server running on port ${port}`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();