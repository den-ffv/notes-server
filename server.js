import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import authRouter from "./routes/authRouter.js";
import dotenv from "dotenv";
const PORT = process.env.PORT || 5000;

const app = express();

app.use(cors());

app.use(express.json());

dotenv.config();

app.use("/api", authRouter);

const databaseUrl = process.env.DATABASE_URL;

const start = async () => {
  try {
    await mongoose.connect(databaseUrl);
    app.listen(PORT, () => console.log(`Server ====== OK. Work in : ${PORT}`));
  } catch (err) {
    console.log(err);
  }
};

start();
