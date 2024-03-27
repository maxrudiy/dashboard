import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import { errorLoggerMiddleware, errorResponseMiddleware } from "./middlewares/errors-middlewares.js";
import authRoutes from "./routes/auth-routes.js";
import s321Routes from "./routes/s321-routes.js";

const PORT = process.env.PORT;
const whitelist = ["http://localhost:3000"];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
};

const app = express();

app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());
app.use("/auth", authRoutes);
app.use("/s321", s321Routes);
app.use(errorLoggerMiddleware);
app.use(errorResponseMiddleware);

const start = async () => {
  try {
    await new Promise((resolve, reject) => {
      mongoose.connect(process.env.DB_URL, { maxPoolSize: 10 });
      mongoose.connection.on("connected", () => {
        console.log("Connected to database");
        resolve();
      });
      mongoose.connection.on("error", (err) => reject(err));
    });
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  } catch (err) {
    console.log(err);
  }
};
start();
